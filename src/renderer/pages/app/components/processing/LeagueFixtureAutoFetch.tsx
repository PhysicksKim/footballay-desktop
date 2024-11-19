import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '@app/store/store';
import fetchFixtureList from '@app/store/slices/select/list/fixtureListSliceThunk';

const LeagueFixtureAutoFetch = () => {
  const leagueId = useSelector((state: RootState) => state.selected.leagueId);
  const dispatch = useDispatch<AppDispatch>();

  const fetchFixturesWhenLeagueSelected = (leagueId: number) => {
    dispatch(fetchFixtureList({ leagueId, date: '' }));
  };

  useEffect(() => {
    if (leagueId) {
      fetchFixturesWhenLeagueSelected(leagueId);
    }
  }, [leagueId]);

  return <></>;
};

export default LeagueFixtureAutoFetch;
