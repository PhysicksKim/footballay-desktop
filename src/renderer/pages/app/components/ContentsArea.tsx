import React from 'react';
import { Route, Routes } from 'react-router-dom';

import FixtureSelectTab from './tabs/fixture/FixtureSelectTab';

import '@app/styles/ContentsArea.scss';
import SettingsTab from './tabs/settings/SettingsTab';

const ContentsArea = () => {
  return (
    <div className="content-area-container">
      <Routes>
        <Route path="/" element={<FixtureSelectTab />} />
        <Route path="/settings" element={<SettingsTab />} />
        <Route path="/v1/fixtures" element={<FixtureSelectTab />} />
      </Routes>
    </div>
  );
};

export default ContentsArea;
