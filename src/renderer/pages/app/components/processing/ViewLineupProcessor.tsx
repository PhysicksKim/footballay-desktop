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
      ? processLineupToView(lineup.lineup?.home, processedEvents)
      : null;
    const awayViewLineup = lineup?.lineup
      ? processLineupToView(lineup.lineup?.away, processedEvents)
      : null;

    dispatch(
      setProcessedLineup({
        home: homeViewLineup,
        away: awayViewLineup,
      }),
    );
  }, [lineup, events, filterEvents]);

  return <></>;
};

export default ViewLineupProcessor;
