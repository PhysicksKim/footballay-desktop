import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { startOfDay, addDays, format } from 'date-fns';
import { ko } from 'date-fns/locale';

import { AppDispatch, RootState } from '@app/store/store';
import fetchFixtureList, {
  FixtureListItemResponse,
} from '@src/renderer/pages/app/store/slices/select/list/fixtureListSliceThunk';
import { setSelectedDate } from '@src/renderer/pages/app/store/slices/select/footballSelectionSlice';
import FixtureListBox from './FixtureListBox';

import '@app/styles/tabs/FixtureSlideBox.scss';
import {
  fixtureDateStrToDate,
  isNotSameDate,
} from '@src/renderer/pages/app/common/DateUtils';

const FixtureSlideBox = () => {
  const dispatch = useDispatch<AppDispatch>();
  const fixtures = useSelector(
    (state: RootState) => state.fixtureList.fixtures,
  );
  const selectedLeagueId = useSelector(
    (state: RootState) => state.selected.leagueId,
  );
  const selectedDateStr = useSelector(
    (state: RootState) => state.selected.date,
  );

  const [today, setToday] = useState<Date>(
    startOfDay(selectedDateStr ? selectedDateStr : new Date()),
  );
  const [dates, setDates] = useState<Date[]>([]);

  /**
   * 경기 목록이 변경된 경우, 선택된 날짜 redux state 를 변경합니다.
   */
  useEffect(() => {
    const firstFixture = fixtures[0];
    setSelectedDateIfFixtureDateChanged(firstFixture, selectedDateStr);
  }, [fixtures]);

  /**
   * 선택된 날짜가 변경된 경우, 날짜 목록을 갱신합니다.
   */
  useEffect(() => {
    if (selectedDateStr) {
      const _today = startOfDay(selectedDateStr);
      setToday(_today);

      const _dates = createDateArrayWithPrevAndNext3Days(_today);
      setDates(_dates);
    }
  }, [selectedDateStr]);

  const setSelectedDateIfFixtureDateChanged = useCallback(
    (fixture: FixtureListItemResponse | undefined, selectedDateStr: string) => {
      const fixtureDateStr = fixture?.matchSchedule?.kickoff;
      if (fixtureDateStr) {
        const fixtureDate: Date = fixtureDateStrToDate(fixtureDateStr);
        const selectedDate: Date = new Date(selectedDateStr);

        if (isNotSameDate(fixtureDate, selectedDate)) {
          dispatch(setSelectedDate(fixtureDate.toISOString()));
        }
      }
    },
    [],
  );

  const createDateArrayWithPrevAndNext3Days = useCallback((today: Date) => {
    return Array.from({ length: 7 }, (_, i) => addDays(today, i - 3));
  }, []);

  const formatYearMonth = useCallback(
    (date: Date) => format(date, 'yyyy.MM'),
    [],
  );
  const formatDayOfWeek = useCallback(
    (date: Date) => format(date, 'EEE dd', { locale: ko }),
    [],
  );

  const fetchDateFixtureList = (date: Date) => {
    if (!selectedLeagueId) return;
    dispatch(
      fetchFixtureList({
        leagueId: selectedLeagueId,
        date: date.toISOString(),
      }),
    );
    dispatch(setSelectedDate(date.toISOString()));
  };

  const renderedDateItems = dates.map((date, index) => {
    const dayOfWeek = format(date, 'EEE', { locale: ko });
    const isToday = format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
    const isSat = dayOfWeek === '토';
    const isSun = dayOfWeek === '일';

    return (
      <div
        key={index}
        className={`date-slide-item date_${index} ${isSat ? 'date_sat' : ''} ${
          isSun ? 'date_sun' : ''
        } ${isToday ? 'date_today' : ''}`}
        onClick={() => fetchDateFixtureList(date)}
      >
        {formatDayOfWeek(date)}
      </div>
    );
  });

  return (
    <div className="fixture-box-container">
      <div className="fixture-box">
        <div className="fixture-year-month">{formatYearMonth(today)}</div>
        <div className="fixture-date-slide-bar">
          {renderedDateItems}
          <div className="date-slide-prev-btn">{'<'}</div>
          <div className="date-slide-next-btn">{'>'}</div>
        </div>
        <FixtureListBox />
      </div>
    </div>
  );
};

export default FixtureSlideBox;
