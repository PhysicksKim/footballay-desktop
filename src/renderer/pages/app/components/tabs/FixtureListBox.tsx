import React, { useEffect } from 'react';
import '@app/styles/tabs/FixtureListBox.scss';
import FixtureListItem from './FixtureListItem';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@app/store/store';
import fetchFixtureList from '@app/store/slices/fixtureListSliceThunk';

const FixtureListBox = () => {
  const dispatch = useDispatch<AppDispatch>();
  const fixtures = useSelector(
    (state: RootState) => state.fixtureList.fixtures,
  );
  const selectedLeagueId = useSelector(
    (state: RootState) => state.selected.leagueId,
  );

  useEffect(() => {
    // Fetch the fixture list when the component mounts
    dispatch(
      fetchFixtureList({ leagueId: 39, date: '', options: { closest: true } }),
    );
  }, [dispatch]);

  return (
    <div className="fixture-list-box-container">
      <div className="fixture-list-box">
        {fixtures.map((fixture, index) => (
          <FixtureListItem
            key={index}
            {...fixture}
            leagueId={selectedLeagueId}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default FixtureListBox;
