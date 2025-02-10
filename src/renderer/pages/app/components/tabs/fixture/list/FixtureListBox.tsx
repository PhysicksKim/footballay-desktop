import React, { useMemo } from 'react';
import { cloneDeep } from 'lodash';
import { useSelector } from 'react-redux';

import { RootState } from '@app/store/store';
import FixtureListItem from '@app/components/tabs/fixture/list/FixtureListItem';
import { parseDateTimeString } from '@app/common/DateUtils';

import '@app/styles/tabs/FixtureListBox.scss';

const FixtureListBox = () => {
  const fixtures = useSelector(
    (state: RootState) => state.fixtureList.fixtures
  );
  const selectedLeagueId = useSelector(
    (state: RootState) => state.selected.leagueId
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

    const copiedFixtures = cloneDeep(fixtures);
    // 1) 경기 시작 시간 2) 경기 ID 순으로 정렬
    copiedFixtures.sort((a, b) => {
      const aKickOffDate = parseDateTimeString(a.matchSchedule.kickoff);
      const bKickOffDate = parseDateTimeString(b.matchSchedule.kickoff);

      if (isNaN(aKickOffDate.getTime()) || isNaN(bKickOffDate.getTime())) {
        console.error('유효하지 않은 날짜 형식입니다.');
        return 0;
      }

      if (aKickOffDate < bKickOffDate) {
        return -1;
      } else if (aKickOffDate > bKickOffDate) {
        return 1;
      } else {
        return a.fixtureId - b.fixtureId;
      }
    });

    return copiedFixtures.map((fixture, index) => (
      <FixtureListItem
        key={`${fixture.fixtureId}_${index}`}
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
