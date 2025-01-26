const Urls = {
  apiUrl: process.env.API_URL,
  websocketUrl: process.env.WEBSOCKET_URL,
  football: {
    leagues: '/api/football/leagues/available',
    fixtures: '/api/football/fixtures',
    fixturesOnDate: '/api/football/fixtures/date',
    fixtureInfo: '/api/football/fixtures/info',
    fixtureLiveStatus: '/api/football/fixtures/live-status',
    fixtureLineup: '/api/football/fixtures/lineup',
    fixtureEvents: '/api/football/fixtures/events',
    fixtureStatistics: '/api/football/fixtures/statistics',
    availableFixtures: '/api/football/stream/fixtures/available',
    preferenceKeyCheck: () => '/api/football/preferences/validate',
  },
};

export default Urls;
