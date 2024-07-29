import React, { useEffect, useMemo } from 'react';
import '@app/styles/tabs/FixtureListBox.scss';
import FixtureListItem from './FixtureListItem';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@app/store/store';

const FixtureListBox = () => {
  const fixtures = useSelector(
    (state: RootState) => state.fixtureList.fixtures,
  );
  const selectedLeagueId = useSelector(
    (state: RootState) => state.selected.leagueId,
  );

  const fixtureItems = useMemo(() => {
    return fixtures.map((fixture, index) => (
      <FixtureListItem
        key={index}
        {...fixture}
        leagueId={selectedLeagueId}
        index={index}
      />
    ));
  }, [fixtures]);

  return (
    <div className="fixture-list-box-container">
      <div className="fixture-list-box">{fixtureItems}</div>
    </div>
  );
};

export default FixtureListBox;
