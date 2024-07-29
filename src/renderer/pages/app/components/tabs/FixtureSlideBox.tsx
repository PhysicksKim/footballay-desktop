import React, { useCallback, useEffect, useMemo, useState } from 'react';
import '@app/styles/tabs/FixtureSlideBox.scss';
import FixtureListBox from './FixtureListBox';
import { useDispatch, useSelector } from 'react-redux';
import { startOfDay, addDays, format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { AppDispatch, RootState } from '@app/store/store';
import fetchFixtureList from '@app/store/slices/fixtureListSliceThunk';
import { setDate } from '@app/store/slices/footballSelectionSlice';

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

  useEffect(() => {
    console.log('fixtures', fixtures);
    const firstFixture = fixtures[0];
    const fixtureDate = firstFixture?.matchSchedule?.kickoff;
    if (fixtureDate) {
      const _YMD = fixtureDate.split(' ')[0];
      const _year = parseInt(_YMD.split('-')[0]);
      const _month = parseInt(_YMD.split('-')[1]) - 1;
      const _day = parseInt(_YMD.split('-')[2]);
      const _date = new Date(_year, _month, _day);
      const selectedDate = new Date(selectedDateStr);

      const isSameDate =
        _date.getFullYear() === selectedDate.getFullYear() &&
        _date.getMonth() === selectedDate.getMonth() &&
        _date.getDate() === selectedDate.getDate();

      if (!isSameDate) {
        dispatch(setDate(_date.toISOString()));
      }
    }
  }, [fixtures]);

  useEffect(() => {
    console.log('selectedDateStr', selectedDateStr);
    if (selectedDateStr) {
      const _today = startOfDay(selectedDateStr);
      setToday(_today);
      const _dates = Array.from({ length: 7 }, (_, i) =>
        addDays(_today, i - 3),
      );
      setDates(_dates);
    }
  }, [selectedDateStr]);

  const formatDate = useCallback((date: Date) => format(date, 'yyyy.MM'), []);
  const formatDay = useCallback(
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
    dispatch(setDate(date.toISOString()));
  };

  const dateList = dates.map((date, index) => {
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
        {formatDay(date)}
      </div>
    );
  });

  return (
    <div className="fixture-box-container">
      <div className="fixture-box">
        <div className="fixture-year-month">{formatDate(today)}</div>
        <div className="fixture-date-slide-bar">
          {dateList}
          <div className="date-slide-prev-btn">{'<'}</div>
          <div className="date-slide-next-btn">{'>'}</div>
        </div>
        <FixtureListBox />
      </div>
    </div>
  );
};

export default FixtureSlideBox;
