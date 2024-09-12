import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import {
  FixtureEvent,
  FixtureLineup,
  LineupTeam,
  ViewLineup,
} from '@src/types/FixtureIpc';
import { processLineupToView } from './ViewLineupLogic';
import { setProcessedLineup } from '../../store/slices/fixtureProcessedDataSlice';

const ViewLineupProcessor = () => {
  const dispatch = useDispatch();
  const events = useSelector((state: RootState) => state.fixtureLive.events);
  const lineup = useSelector((state: RootState) => state.fixtureLive.lineup);
  const fixtureProcessedData = useSelector(
    (state: RootState) => state.fixtureProcessedData,
  );

  useEffect(() => {
    console.log('processed lineup');
    const homeViewLineup = lineup
      ? processLineupToView(lineup.lineup.home, events?.events || [])
      : null;
    const awayViewLineup = lineup
      ? processLineupToView(lineup.lineup.away, events?.events || [])
      : null;

    dispatch(
      setProcessedLineup({
        home: homeViewLineup,
        away: awayViewLineup,
      }),
    );
  }, [lineup, events]);

  useEffect(() => {
    console.log('fixtureProcessedData', fixtureProcessedData);
  }, [fixtureProcessedData]);

  return <></>;
};

export default ViewLineupProcessor;
