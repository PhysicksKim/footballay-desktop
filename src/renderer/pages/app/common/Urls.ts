const Urls = {
  apiUrl: process.env.API_URL,
  websocketUrl: process.env.WEBSOCKET_URL,
  football: {
    leagues: '/api/football/leagues/available',
    fixtures: '/api/football/fixtures',
    fixturesOnDate: '/api/football/fixtures/date',
    fixtureInfo: '/api/football/fixtures/info',
    fixtureEvents: '/api/football/fixtures/events',
    availableFixtures: '/api/football/stream/fixtures/available',
  },
};

export default Urls;
