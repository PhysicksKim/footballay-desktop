/**
 * @Deprecated 초기 버전에서 사용하던 Url 관리 파일 입니다. 동작하고 있으나 v1 버전에서 사용하지 않습니다.
 */
const Urls = {
  domainUrl: import.meta.env.VITE_DOMAIN_URL,
  websocketUrl: import.meta.env.VITE_WEBSOCKET_URL,
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
