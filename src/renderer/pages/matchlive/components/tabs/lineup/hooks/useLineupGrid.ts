import { useState, useEffect, useMemo } from 'react';
import {
  StartLineup,
  EventInfo,
  PlayerStatistics,
  LineupPlayer,
  PlayerWithStatistics,
} from '@src/renderer/pages/app/v1/types/api';
import {
  ViewLineup,
  ViewPlayer,
  ViewPlayerEvents,
} from '../types';

const createEmptyEvents = (): ViewPlayerEvents => ({
  subIn: false,
  yellow: false,
  red: false,
  goal: [],
});

const processTeamLineup = (
  teamLineup: StartLineup,
  statisticsMap: Map<string, PlayerStatistics>
): ViewLineup => {
  const playersByGrid: ViewPlayer[][] = [];

  // Process starting players
  teamLineup.players.forEach((player) => {
    try {
      if (!player || !player.grid) {
        return;
      }
      // Grid format "Row:Col", e.g., "4:2". Row is 1-based index.
      const gridRowIndex = parseInt(player.grid.split(':')[0], 10) - 1;
      
      if (!playersByGrid[gridRowIndex]) {
        playersByGrid[gridRowIndex] = [];
      }

      const statistics = statisticsMap.get(player.matchPlayerUid) || null;

      playersByGrid[gridRowIndex].push({
        ...player,
        events: createEmptyEvents(),
        statistics,
        subInPlayer: null,
      });
    } catch (e) {
      console.error('Error processing player grid', e);
    }
  });

  // Process substitutes
  const substituteViewLineup = teamLineup.substitutes.map((sub) => {
    const statistics = statisticsMap.get(sub.matchPlayerUid) || null;
    return {
      ...sub,
      events: createEmptyEvents(),
      statistics,
      subInPlayer: null,
    };
  });

  return {
    teamUid: teamLineup.teamUid,
    teamName: teamLineup.teamName,
    players: playersByGrid,
    substitutes: substituteViewLineup,
  };
};

// Helper to find the current player on the field (handling substitutions)
const getCurrentPlayer = (player: ViewPlayer): ViewPlayer => {
  let current = player;
  while (current.subInPlayer) {
    current = current.subInPlayer;
  }
  return current;
};

// Check if a player is currently on the field (checking substitution chain)
const isPlayerOnField = (
  matchPlayerUid: string,
  lineupGrid: ViewPlayer[][]
): { found: boolean; rootPlayer?: ViewPlayer } => {
  for (let i = 0; i < lineupGrid.length; i++) {
    const row = lineupGrid[i];
    if (!row) continue;
    
    for (let j = 0; j < row.length; j++) {
      const rootPlayer = row[j];
      const current = getCurrentPlayer(rootPlayer);
      
      if (current.matchPlayerUid === matchPlayerUid) {
        return { found: true, rootPlayer };
      }
    }
  }
  return { found: false };
};

const updatePlayerGoal = (event: EventInfo, lineup: ViewLineup) => {
  if (!event.player) return;
  
  const { found, rootPlayer } = isPlayerOnField(event.player.matchPlayerUid, lineup.players);
  
  if (found && rootPlayer) {
    const target = getCurrentPlayer(rootPlayer);
    const isOwnGoal = event.detail?.toLowerCase().includes('own') || false;
    
    target.events.goal.push({
      minute: event.elapsed,
      ownGoal: isOwnGoal,
    });
  }
};

const updatePlayerCard = (event: EventInfo, lineup: ViewLineup) => {
  if (!event.player || !event.detail) return;
  
  const { found, rootPlayer } = isPlayerOnField(event.player.matchPlayerUid, lineup.players);
  
  if (found && rootPlayer) {
    const target = getCurrentPlayer(rootPlayer);
    
    if (event.detail === 'Yellow Card') {
      target.events.yellow = true;
    } else if (event.detail === 'Red Card') {
      target.events.red = true;
    }
  }
};

const updatePlayerSubst = (event: EventInfo, lineup: ViewLineup) => {
  // Determine which player is subbing out (on field) and which is subbing in (from bench)
  if (!event.player || !event.assist) return;

  const player1 = event.player;
  const player2 = event.assist;

  const p1OnField = isPlayerOnField(player1.matchPlayerUid, lineup.players);
  const p2OnField = isPlayerOnField(player2.matchPlayerUid, lineup.players);

  let subOutPlayer: ViewPlayer | null = null;
  let subInInfo: LineupPlayer | null = null;

  if (p1OnField.found) {
    subOutPlayer = getCurrentPlayer(p1OnField.rootPlayer!);
    subInInfo = player2;
  } else if (p2OnField.found) {
    subOutPlayer = getCurrentPlayer(p2OnField.rootPlayer!);
    subInInfo = player1;
  } else {
    return;
  }

  // Find the substitute player details and link them to the subbed-out player
  const substituteDetails = lineup.substitutes.find(
    (sub) => sub.matchPlayerUid === subInInfo!.matchPlayerUid
  );

  if (substituteDetails && subOutPlayer) {
     const subInViewPlayer: ViewPlayer = {
       ...substituteDetails,
       events: { ...createEmptyEvents(), subIn: true },
       statistics: substituteDetails.statistics,
       subInPlayer: null,
       grid: subOutPlayer.grid, // Inherit grid position from subbed-out player
     };

     subOutPlayer.subInPlayer = subInViewPlayer;
  }
};

const applyEventsToLineup = (
  lineup: ViewLineup,
  events: EventInfo[]
): ViewLineup => {
  // Apply events to lineup (mutates lineup in place)
  // Note: This function is called after processTeamLineup, which creates a fresh structure
  
  events.forEach((event) => {
    const eventType = event.type.toUpperCase();
    
    // For non-GOAL events, only process events for this team
    if (event.team.teamUid !== lineup.teamUid && eventType !== 'GOAL') {
      return;
    }
    
    if (!event.player) {
      return;
    }

    switch (eventType) {
      case 'GOAL':
        updatePlayerGoal(event, lineup);
        break;
      case 'CARD':
        updatePlayerCard(event, lineup);
        break;
      case 'SUBST':
        updatePlayerSubst(event, lineup);
        break;
    }
  });

  return lineup;
};

export const useLineupGrid = (
  homeLineup: StartLineup | undefined,
  awayLineup: StartLineup | undefined,
  events: EventInfo[] = [],
  playerStatisticsMap: Map<string, PlayerStatistics>, // Map matchPlayerUid -> Stats
  filterEventSequences: Set<number> = new Set() // Filtered event sequences to exclude
) => {
  const [processedHome, setProcessedHome] = useState<ViewLineup | null>(null);
  const [processedAway, setProcessedAway] = useState<ViewLineup | null>(null);

  useEffect(() => {
    if (homeLineup) {
      // Filter events inside useEffect to avoid creating new array on every render
      const filteredEvents = events.filter(
        (event) => !filterEventSequences.has(event.sequence)
      );
      let processed = processTeamLineup(homeLineup, playerStatisticsMap);
      processed = applyEventsToLineup(processed, filteredEvents);
      setProcessedHome(processed);
    } else {
      setProcessedHome(null);
    }
  }, [homeLineup, events, filterEventSequences, playerStatisticsMap]);

  useEffect(() => {
    if (awayLineup) {
      // Filter events inside useEffect to avoid creating new array on every render
      const filteredEvents = events.filter(
        (event) => !filterEventSequences.has(event.sequence)
      );
      let processed = processTeamLineup(awayLineup, playerStatisticsMap);
      processed = applyEventsToLineup(processed, filteredEvents);
      setProcessedAway(processed);
    } else {
      setProcessedAway(null);
    }
  }, [awayLineup, events, filterEventSequences, playerStatisticsMap]);

  return {
    processedHome,
    processedAway,
  };
};

