import React, { useRef, useEffect, useState } from 'react';
import '@app/styles/tabs/SelectFixtureTab.scss';
import FixtureSlideBox from './FixtureSlideBox';
import LeagueCardSlide from './LeagueCardSlide';

const SelectFixtureTab = () => {
  return (
    <div className="select-fixture-tab-container">
      <LeagueCardSlide />
      <FixtureSlideBox />
    </div>
  );
};

export default SelectFixtureTab;
