import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Sector,
  Text,
  ResponsiveContainer,
} from 'recharts';
import styled from 'styled-components';

interface V1PassSuccessPieChartProps {
  homePassSuccess: number;
  awayPassSuccess: number;
  homeColor: string;
  awayColor: string;
}

const PIE_BACKGROUND_FILL = '#aaaaaa';

const V1PassSuccessPieChart: React.FC<V1PassSuccessPieChartProps> = ({
  homePassSuccess,
  awayPassSuccess,
  homeColor,
  awayColor,
}) => {
  const HOME_COLOR = homeColor;
  const AWAY_COLOR = awayColor;

  const homeData = [
    { name: '성공', value: homePassSuccess },
    { name: '실패', value: 100 - homePassSuccess },
  ];

  const awayData = [
    { name: '성공', value: awayPassSuccess },
    { name: '실패', value: 100 - awayPassSuccess },
  ];

  const renderCustomActiveShape = (props: any) => {
    const {
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      percent,
    } = props;

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 5} // 성공 부분 살짝 강조
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Text
          x={cx}
          y={cy}
          fill={'#000'}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={16}
          fontWeight="bold"
        >
          {`${(percent * 100).toFixed(0)}%`}
        </Text>
      </g>
    );
  };

  return (
    <PassSuccessPieChartStyle>
      <PassSuccessTitle>패스 성공률</PassSuccessTitle>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          width: '90%',
        }}
      >
        {/* 홈 팀 파이 차트 */}
        <ChartWrapper>
          <ResponsiveContainer width="100%" maxHeight={150} aspect={1}>
            <PieChart>
              <Pie
                data={homeData}
                cx="50%"
                cy="50%"
                outerRadius="100%"
                innerRadius="70%"
                labelLine={false}
                activeIndex={0}
                activeShape={renderCustomActiveShape}
                fill={PIE_BACKGROUND_FILL}
                dataKey="value"
                isAnimationActive={true}
                animationDuration={300}
              >
                <Cell fill={HOME_COLOR} />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartWrapper>

        {/* 어웨이 팀 파이 차트 */}
        <ChartWrapper>
          <ResponsiveContainer width="100%" maxHeight={150} aspect={1}>
            <PieChart>
              <Pie
                data={awayData}
                cx="50%"
                cy="50%"
                outerRadius="100%"
                innerRadius="70%"
                labelLine={false}
                activeIndex={0}
                activeShape={renderCustomActiveShape}
                fill={PIE_BACKGROUND_FILL}
                dataKey="value"
                isAnimationActive={true}
                animationDuration={300}
              >
                <Cell fill={AWAY_COLOR} />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </div>
    </PassSuccessPieChartStyle>
  );
};

export default V1PassSuccessPieChart;

const PassSuccessPieChartStyle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  align-items: center;
  width: 95%;
  overflow: visible;
  box-sizing: content-box;
  margin: 0;
  padding: 0;
  padding-bottom: 10px;
  padding-top: 10px;
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
`;

const PassSuccessTitle = styled.div`
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 10px;
  color: #111; // Changed to black/dark
`;

const ChartWrapper = styled.div`
  margin: 0 1rem;
  width: 30%;
`;
