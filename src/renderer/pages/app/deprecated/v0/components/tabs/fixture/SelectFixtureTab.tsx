import React from 'react';

import FixtureSlideBox from './list/FixtureSlideBox';
import LeagueCardSlide from './league/LeagueCardSlide';

import '@app/styles/tabs/SelectFixtureTab.scss';

const SelectFixtureTab = () => {
  return (
    <div className="select-fixture-tab-container">
      <LeagueCardSlide />
      <FixtureSlideBox />
    </div>
  );
};

export default SelectFixtureTab;
