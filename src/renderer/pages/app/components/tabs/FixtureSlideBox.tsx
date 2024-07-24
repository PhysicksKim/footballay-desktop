import React from 'react';
import '@app/styles/tabs/FixtureSlideBox.scss';
import FixtureListBox from './FixtureListBox';

const FixtureSlideBox = () => {
  return (
    <div className="fixture-box-container">
      <div className="fixture-box">
        <div className="fixture-year-month">2024.07</div>
        <div className="fixture-date-slide-bar">
          <div className="date-slide-item date_0">수 17</div>
          <div className="date-slide-item date_1">목 18</div>
          <div className="date-slide-item date_2">금 19</div>
          <div className="date-slide-item date_3 date_sat date_today">
            토 20
          </div>
          <div className="date-slide-item date_4 date_sun">일 21</div>
          <div className="date-slide-item date_5">월 22</div>
          <div className="date-slide-item date_6">화 23</div>
          <div className="date-slide-prev-btn">{'<'}</div>
          <div className="date-slide-next-btn">{'>'}</div>
        </div>
        <FixtureListBox />
      </div>
    </div>
  );
};

export default FixtureSlideBox;
