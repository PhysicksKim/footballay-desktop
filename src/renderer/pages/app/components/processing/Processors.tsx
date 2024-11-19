import React from 'react';
import ViewLineupProcessor from './ViewLineupProcessor';
import EventMetaProcessor from './EventMetaProcessor';
import LeagueFixtureAutoFetch from './LeagueFixtureAutoFetch';

const Processors = () => {
  return (
    <>
      <LeagueFixtureAutoFetch />
      <ViewLineupProcessor />
      <EventMetaProcessor />
    </>
  );
};

export default Processors;
