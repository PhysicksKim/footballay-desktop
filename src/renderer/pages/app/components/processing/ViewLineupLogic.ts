import {
  LineupTeam,
  FixtureEvent,
  FixtureStatistics,
  PlayerStatisticsResponse,
} from '@src/types/FixtureIpc';
import {
  ViewPlayer,
  ViewLineup,
  ViewPlayerEvents,
  Goal,
} from '@src/types/FixtureIpc';

export const isSubOutPlayer = (
  checkId: number,
  lineup: ViewPlayer[][],
): boolean => {
  for (let i = 0; i < lineup.length; i++) {
    for (let j = 0; j < lineup[i].length; j++) {
      let currentPlayer = lineup[i][j];
      if (!currentPlayer) {
        continue;
      }

      while (currentPlayer?.subInPlayer) {
        currentPlayer = currentPlayer.subInPlayer;
      }

      if (currentPlayer?.id === checkId) {
        return true;
      }
    }
  }
  return false;
};

export const processTeamLineup = (
  teamLineup: LineupTeam,
  statisticsMap: Map<number, PlayerStatisticsResponse>,
): ViewLineup => {
  const playersByGrid: ViewPlayer[][] = [];

  /**
   * player 에서 해당 선수가 속한 grid 를 추출해서, <br>
   * ViewPlayer[][] 에서 들어갈 그리드 위치를 정해줌 <br>
   * ViewPlayer[라인넘버][해당라인에서위치]
   */
  teamLineup.players.forEach((player) => {
    const gridLine = parseInt(player.grid.split(':')[0], 10) - 1;
    if (!playersByGrid[gridLine]) {
      playersByGrid[gridLine] = [];
    }
    const events: ViewPlayerEvents = {
      subIn: false,
      yellow: false,
      red: false,
      goal: [],
    };
    const subInPlayer = null;

    const statistics = statisticsMap.get(player.id) || null;

    playersByGrid[gridLine].push({
      ...player,
      events,
      statistics,
      subInPlayer,
    });
  });

  const substituteViewLineup = teamLineup.substitutes.map((sub) => {
    const events: ViewPlayerEvents = {
      subIn: false,
      yellow: false,
      red: false,
      goal: [],
    };
    const subInPlayer = null;

    const statistics = statisticsMap.get(sub.id) || null;

    return {
      ...sub,
      events,
      statistics,
      subInPlayer,
    };
  });

  return {
    teamId: teamLineup.teamId,
    teamName: teamLineup.teamName,
    players: playersByGrid,
    substitutes: substituteViewLineup,
  };
};

const updatePlayerGoal = (event: FixtureEvent, players: ViewPlayer[][]) => {
  const { player } = event;

  for (let i = 0; i < players.length; i++) {
    for (let j = 0; j < players[i].length; j++) {
      const targetPlayer = players[i][j];

      if (targetPlayer.id === player.playerId) {
        markPlayerGotScored(targetPlayer, event);
        return;
      }

      // 재귀적으로 교체 선수가 골 넣었는지 체크
      let currentPlayer = targetPlayer.subInPlayer;
      while (currentPlayer) {
        if (currentPlayer.id === player.playerId) {
          markPlayerGotScored(currentPlayer, event);
          return;
        }
        currentPlayer = currentPlayer.subInPlayer;
      }
    }
  }
};

const updatePlayerCard = (event: FixtureEvent, players: ViewPlayer[][]) => {
  const { player, detail } = event;
  const cardType = detail;

  for (let i = 0; i < players.length; i++) {
    for (let j = 0; j < players[i].length; j++) {
      const targetPlayer = players[i][j];

      if (targetPlayer.id === player.playerId) {
        if (cardType === 'Yellow Card') {
          targetPlayer.events.yellow = true;
        } else if (cardType === 'Red Card') {
          targetPlayer.events.red = true;
        }
        return;
      }

      let currentPlayer = targetPlayer.subInPlayer;
      while (currentPlayer) {
        if (currentPlayer.id === player.playerId) {
          if (cardType === 'Yellow Card') {
            currentPlayer.events.yellow = true;
          } else if (cardType === 'Red Card') {
            currentPlayer.events.red = true;
          }
          return;
        }
        currentPlayer = currentPlayer.subInPlayer;
      }
    }
  }
};

/**
 * 자책골인 경우 event 에서 detail: "Own Goal" 로 표기됨.
 * @param player
 * @param event
 */
const markPlayerGotScored = (player: ViewPlayer, event: FixtureEvent): void => {
  const { elapsed, detail } = event;
  const isOwnGoal: boolean = (() => {
    return detail?.toLowerCase().includes('own');
  })();
  const goal: Goal = {
    minute: elapsed,
    ownGoal: isOwnGoal,
  };
  player.events.goal.push(goal);
};

// players 2차원 배열을 순회하면서 subOutId === viewPlayer.id 인 경우를 찾기
const updateSubInPlayer = (
  subInViewPlayer: ViewPlayer,
  subOutId: number,
  players: ViewPlayer[][],
) => {
  for (let i = 0; i < players.length; i++) {
    for (let j = 0; j < players[i].length; j++) {
      const player = players[i][j];
      const grid = player.grid;

      if (player.id === subOutId) {
        // 교체 되어 나가는 선수를 찾았을 경우, subInPlayer 업데이트
        subInViewPlayer.grid = grid;
        player.subInPlayer = subInViewPlayer;
        return;
      }

      // 교체된 선수가 다시 교체되었는지 재귀적으로 확인
      let currentPlayer = player.subInPlayer;
      while (currentPlayer) {
        if (currentPlayer.id === subOutId) {
          subInViewPlayer.grid = grid;
          currentPlayer.subInPlayer = subInViewPlayer;
          return;
        }
        currentPlayer = currentPlayer.subInPlayer;
      }
    }
  }
};
/*
  퇴장 있는 경기 : k리그(292) 대구vs포항 (1163025)
  자책골 : epl(39) 시즌2024 맨시티vs웨햄 (1208050)
  해트트릭 : epl(39) 시즌2024 맨시티vs웨햄 (1208050)
  경고누적퇴장 : epl(39) 시즌2425(2024) 아스날vs브라이튼 (1208041)
*/
/**
 *
 * @param lineup home 또는 away 팀의 라인업 정보
 * @param events home 과 away 를 모두 포함한 이벤트 정보
 * @returns
 */
export const applyEventsToLineup = (
  lineup: ViewLineup,
  events: FixtureEvent[],
): ViewLineup => {
  events.forEach((event, index) => {
    switch (event.type) {
      case 'SUBST': {
        const { player, assist } = event;

        if (!player || !assist) break;

        let _out, _in;
        if (isSubOutPlayer(player.playerId, lineup.players)) {
          _out = player;
          _in = assist;
        } else {
          _out = assist;
          _in = player;
        }
        const outPlayer = _out;
        const inPlayer = _in;

        // lineup.substitutes에서 교체 들어오는 선수 정보를 찾아서 photo와 position 값을 설정
        const substitute = lineup.substitutes.find(
          (sub) => sub.id === inPlayer.playerId,
        );
        if (!substitute) {
          break;
        }

        const subInViewPlayer: ViewPlayer = {
          id: substitute.id,
          name: substitute.name,
          koreanName: substitute.koreanName,
          number: substitute.number,
          photo: substitute.photo,
          position: substitute.position,
          grid: null,
          events: {
            subIn: true, // 교체되어 들어가는 선수이므로 true
            yellow: false,
            red: false,
            goal: [],
          },
          statistics: substitute.statistics,
          subInPlayer: null,
        };

        const subOutId = outPlayer.playerId;

        // 홈팀과 원정팀의 players를 순회하며 업데이트
        updateSubInPlayer(subInViewPlayer, subOutId, lineup.players);
        break;
      }
      case 'CARD': {
        updatePlayerCard(event, lineup.players);
        break;
      }
      case 'GOAL': {
        updatePlayerGoal(event, lineup.players);
        break;
      }
      default:
        break;
    }
  });

  return lineup;
};

/**
 * Map < playerId, PlayerStatistics > 로 된 맵을 생성합니다.
 * @param map
 * @param statistics
 */
const setStatisticsMap = (
  map: Map<number, PlayerStatisticsResponse>,
  statistics: PlayerStatisticsResponse[],
) => {
  statistics.forEach((stat) => {
    map.set(stat.player.id, stat);
  });
};

export const processLineupToView = (
  teamLineup: LineupTeam,
  events: FixtureEvent[],
  playerStatisticsArray?: PlayerStatisticsResponse[],
): ViewLineup => {
  const statisticsMap: Map<number, PlayerStatisticsResponse> = new Map();
  if (playerStatisticsArray) {
    setStatisticsMap(statisticsMap, playerStatisticsArray);
    console.log('statisticsMap', statisticsMap);
  }

  let lineup: ViewLineup;
  lineup = processTeamLineup(teamLineup, statisticsMap);
  lineup = applyEventsToLineup(lineup, events);
  return lineup;
};
