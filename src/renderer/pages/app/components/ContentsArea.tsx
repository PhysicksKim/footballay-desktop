import React from 'react';
import { Route, Routes } from 'react-router-dom';

import SelectFixtureTab from './tabs/fixture/SelectFixtureTab';
import MatchliveControlTab from './tabs/control/MatchliveControlTab';
import DebugTab from './tabs/debug/DebugTab';

import '@app/styles/ContentsArea.scss';
import SettingsTab from './tabs/settings/SettingsTab';
import SettingsV1Tab from './tabs/settings/SettingsV1Tab';
import V1FixtureSelectTab from './tabs/v1/V1FixtureSelectTab';

const ContentsArea = () => {
  return (
    <div className="content-area-container">
      <Routes>
        <Route path="/" element={<SelectFixtureTab />} />
        <Route path="/debug-tool" element={<DebugTab />} />
        <Route path="/matchlive-control" element={<MatchliveControlTab />} />
        <Route path="/settings" element={<SettingsTab />} />
        <Route path="/settings/v1" element={<SettingsV1Tab />} />
        <Route path="/v1/fixtures" element={<V1FixtureSelectTab />} />
      </Routes>
    </div>
  );
};

export default ContentsArea;
