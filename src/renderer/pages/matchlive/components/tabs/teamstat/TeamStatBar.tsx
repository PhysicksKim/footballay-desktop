import React from 'react';
import { useSelector } from 'react-redux';
import styled, { css } from 'styled-components';
import { RootState } from '../../../store/store';

type StatBarProps = {
  homePercent: number;
  awayPercent: number;
};

const StatBarContainer = styled.div`
  display: flex;
  width: 100%;
  height: 10px;
  position: relative;
  border-radius: 5px;
  overflow: hidden;
  border-bottom: 1px solid #b6b6b6;
`;

const StatSection = styled.div<{ widthPercent: number; bgColor: string }>`
  height: 100%;
  width: ${(props) => props.widthPercent}%;
  background-color: ${(props) => props.bgColor};

  display: flex;
  justify-content: center;
`;

const StatBarWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: visible;
`;

const LabelTextStyle = css`
  font-weight: 500;
  font-size: 1.1rem;
  color: #000;
  background-color: none;

  /* 텍스트 vertical 가운데 정렬 */
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LeftLabel = styled.div`
  ${LabelTextStyle};

  /* 위치 설정 */
  position: absolute;
  left: 0;
  bottom: 0;
  transform: translate(-100%, 0);
  padding-right: 10px;
`;

const RightLabel = styled.div`
  ${LabelTextStyle};

  /* 위치 설정 */
  position: absolute;
  right: 0;
  bottom: 0;
  transform: translate(100%, 0);
  padding-left: 10px;
`;

const TeamStatItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin-top: 5px;
  margin-bottom: 5px;
  width: 100%;
  height: 100%;
  overflow: visible;
`;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: none;
  font-size: 1.2rem;
  font-weight: 500;
  color: #000;
  margin-bottom: 10px;
`;

type TeamStatItemProps = {
  title: string;
  homeStat: number;
  awayStat: number;
};

const TeamStatItem: React.FC<TeamStatItemProps> = ({
  title,
  homeStat,
  awayStat,
}) => {
  // 총합으로 비율 계산
  const total = homeStat + awayStat;
  const homePercent = total === 0 ? 50 : (homeStat / total) * 100;
  const awayPercent = total === 0 ? 50 : (awayStat / total) * 100;

  const teamColor = useSelector((state: RootState) => state.teamColor);
  const homeColor = teamColor.homeColor;
  const awayColor = teamColor.awayColor;

  return (
    <TeamStatItemContainer>
      <TitleWrapper>{title}</TitleWrapper>
      <StatBarWrapper>
        <LeftLabel>{homeStat}</LeftLabel>
        <StatBarContainer>
          <StatSection widthPercent={homePercent} bgColor={homeColor} />
          <StatSection widthPercent={awayPercent} bgColor={awayColor} />
        </StatBarContainer>
        <RightLabel>{awayStat}</RightLabel>
      </StatBarWrapper>
    </TeamStatItemContainer>
  );
};

export default TeamStatItem;
