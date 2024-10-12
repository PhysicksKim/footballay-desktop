import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { FixtureEvent } from '@src/types/FixtureIpc';
import { processLineupToView } from './ViewLineupLogic';
import { setProcessedLineup } from '../../store/slices/fixtureProcessedDataSlice';
import { getFilteredEvents } from './MatchliveIpc';

const ViewLineupProcessor = () => {
  const dispatch = useDispatch();
  const events = useSelector((state: RootState) => state.fixtureLive.events);
  const lineup = useSelector((state: RootState) => state.fixtureLive.lineup);
  const statistics = useSelector(
    (state: RootState) => state.fixtureLive.statistics,
  );
  const filterEvents = useSelector(
    (state: RootState) => state.fixtureLiveControl.filterEvents,
  );

  useEffect(() => {
    let processedEvents;
    if (events) {
      processedEvents = getFilteredEvents(events, filterEvents).events;
    } else {
      processedEvents = [] as FixtureEvent[];
    }
    const homeViewLineup = lineup?.lineup
      ? processLineupToView(
          lineup.lineup?.home,
          processedEvents,
          statistics?.home.playerStatistics,
        )
      : null;
    const awayViewLineup = lineup?.lineup
      ? processLineupToView(
          lineup.lineup?.away,
          processedEvents,
          statistics?.away.playerStatistics,
        )
      : null;

    dispatch(
      setProcessedLineup({
        home: homeViewLineup,
        away: awayViewLineup,
      }),
    );
  }, [lineup, events, filterEvents, statistics]);

  return <></>;
};

export default ViewLineupProcessor;
