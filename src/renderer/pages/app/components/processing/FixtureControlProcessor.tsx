import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '@app/store/store';
import { resetFilterEvents } from '@app/store/slices/live/control/fixtureLiveControlSlice';

const FixtureControlProcessor = () => {
  const dispatch = useDispatch();
  const nowSelectedFixtureId = useSelector(
    (state: RootState) => state.fixtureLive.fixtureId,
  );

  /**
   * 선택된 경기가 변경되면, 이벤트 필터 리스트를 초기화 시킵니다.
   */
  useEffect(() => {
    dispatch(resetFilterEvents());
  }, [nowSelectedFixtureId]);

  return <></>;
};

export default FixtureControlProcessor;
