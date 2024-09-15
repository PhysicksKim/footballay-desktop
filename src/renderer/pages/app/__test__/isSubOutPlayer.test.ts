import { isSubOutPlayer } from '@app/components/processing/ViewLineupLogic';
import { ViewPlayer } from '@src/types/FixtureIpc';

describe('isSubOutPlayer', () => {
  it('should return true when the player is currently on the field', () => {
    const players: ViewPlayer[][] = [
      [
        {
          id: 1,
          name: 'Player 1',
          koreanName: null,
          number: 10,
          photo: '',
          position: 'Forward',
          grid: '2:3',
          events: {
            subIn: false,
            yellow: false,
            red: false,
            goal: [],
          },
          subInPlayer: {
            id: 2,
            name: 'Player 2',
            koreanName: null,
            number: 9,
            photo: '',
            position: 'Forward',
            grid: '',
            events: {
              subIn: true,
              yellow: false,
              red: false,
              goal: [],
            },
            subInPlayer: null,
          },
        },
      ],
    ];

    expect(isSubOutPlayer(1, players)).toBe(false); // 1번 플레이어는 현재 on field에 없음
    expect(isSubOutPlayer(2, players)).toBe(true); // 2번 플레이어는 현재 on field에 있음
  });

  it('should return false when the player is not on the field', () => {
    const players: ViewPlayer[][] = [
      [
        {
          id: 1,
          name: 'Player 1',
          koreanName: null,
          number: 10,
          photo: '',
          position: 'Forward',
          grid: 'A1',
          events: {
            subIn: false,
            yellow: false,
            red: false,
            goal: [],
          },
          subInPlayer: null,
        },
      ],
    ];

    expect(isSubOutPlayer(2, players)).toBe(false); // 2번 플레이어는 현재 on field에 없음
  });
});
