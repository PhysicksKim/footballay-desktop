import React, { useRef } from 'react';
import styled from 'styled-components';
import { format, addDays, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { FixtureByLeagueResponse } from '@app/v1/types/api';
import V1FixtureItem from './V1FixtureItem';
import { FixtureMode } from '@app/v1/api/endpoints';

interface V1FixtureListProps {
  fixtures: FixtureByLeagueResponse[];
  selectedDate: string; // YYYY-MM-DD
  loading: boolean;
  onRequestFetch: (date: string, mode: FixtureMode) => void;
}

const V1FixtureList = ({
  fixtures,
  selectedDate,
  loading,
  onRequestFetch,
}: V1FixtureListProps) => {
  const dateInputRef = useRef<HTMLInputElement>(null);

  const handlePrevious = () => {
    const prevDate = format(addDays(parseISO(selectedDate), -1), 'yyyy-MM-dd');
    onRequestFetch(prevDate, 'previous');
  };

  const handleNext = () => {
    const nextDate = format(addDays(parseISO(selectedDate), 1), 'yyyy-MM-dd');
    onRequestFetch(nextDate, 'nearest');
  };

  const handleDateClick = () => {
    dateInputRef.current?.showPicker();
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    if (newDate) {
      onRequestFetch(newDate, 'exact');
    }
  };

  const formattedDate = parseISO(selectedDate);
  const yearMonth = format(formattedDate, 'yyyy.MM');
  const dayOfWeek = format(formattedDate, 'dd EEE', { locale: ko });
  const dayName = format(formattedDate, 'EEE', { locale: ko });

  const getDayColor = () => {
    if (dayName === '토') return '#5a4fff';
    if (dayName === '일') return '#e85a5a';
    return '#cccccc';
  };

  return (
    <Container>
      <Header>
        <YearMonth>{yearMonth}</YearMonth>
        <ControlBar>
          <NavButton onClick={handlePrevious}>이전 경기</NavButton>

          <DateDisplay onClick={handleDateClick} $dayColor={getDayColor()}>
            <HiddenInput
              ref={dateInputRef}
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
            />
            {dayOfWeek}
          </DateDisplay>

          <NavButton onClick={handleNext}>다음 경기</NavButton>
        </ControlBar>
      </Header>

      <ListBox>
        {loading ? (
          <Message>경기 정보를 불러오는 중...</Message>
        ) : fixtures.length === 0 ? (
          <Message>경기가 없습니다.</Message>
        ) : (
          fixtures.map((fixture) => (
            <V1FixtureItem key={fixture.uid} fixture={fixture} />
          ))
        )}
      </ListBox>
    </Container>
  );
};

export default V1FixtureList;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
  height: 100%;
  overflow: hidden;
  padding-left: 30px;
  padding-right: 20px;
  box-sizing: border-box;
  margin-top: 30px;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
`;

const YearMonth = styled.div`
  font-size: 18px;
  font-weight: 400;
  padding-bottom: 1px;
  color: white;
`;

const ControlBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 400px;
  margin-top: 1px;
`;

const NavButton = styled.button`
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
  color: white;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const DateDisplay = styled.div<{ $dayColor: string }>`
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 8px;
  position: relative;
  color: ${({ $dayColor }) => $dayColor};

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const HiddenInput = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;

  &::-webkit-calendar-picker-indicator {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    width: auto;
    height: auto;
    cursor: pointer;
  }
`;

const ListBox = styled.div`
  flex: 1;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.05);
  padding: 17px 20px;
  box-sizing: border-box;
  border-radius: 10px;
  overflow-y: auto;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #3e4451;
    border-radius: 5px;
  }
  &::-webkit-scrollbar-track {
    background-color: #282c34;
    border-radius: 5px;
  }
`;

const Message = styled.div`
  width: 100%;
  text-align: center;
  color: #9d9d9d;
  margin-top: 20px;
`;
