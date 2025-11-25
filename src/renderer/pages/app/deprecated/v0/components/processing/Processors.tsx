import React from 'react';
import ViewLineupProcessor from './ViewLineupProcessor';
import EventMetaProcessor from './EventMetaProcessor';
import LeagueFixtureAutoFetch from './LeagueFixtureAutoFetch';
import FixtureControlProcessor from './FixtureControlProcessor';

const Processors = () => {
  return (
    <>
      <LeagueFixtureAutoFetch />
      <ViewLineupProcessor />
      <EventMetaProcessor />
      <FixtureControlProcessor />
    </>
  );
};

export default Processors;
