import React, { useEffect, useMemo, useRef } from 'react';
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
    if (!selectedLeagueId || selectedLeagueId < 0) {
      return (
        <div style={{ width: '100%', textAlign: 'center' }}>
          리그를 선택해 주세요
        </div>
      );
    }

    if (fixtures.length === 0) {
      return (
        <div style={{ width: '100%', textAlign: 'center' }}>
          경기가 없습니다
        </div>
      );
    }

    return fixtures.map((fixture, index) => (
      <FixtureListItem
        key={index}
        {...fixture}
        leagueId={selectedLeagueId}
        fixtureId={fixture.fixtureId}
        index={index}
        available={fixture.available}
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
