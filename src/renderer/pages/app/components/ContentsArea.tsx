import React from 'react';
import { HashRouter, Route, Router, Routes } from 'react-router-dom';
import SelectFixtureTab from './tabs/SelectFixtureTab';
import DebugTab from './tabs/DebugTab';
import '@app/styles/ContentsArea.scss';
import MatchliveControlTab from './tabs/MatchliveControlTab';

const ContentsArea = () => {
  return (
    <div className="content-area-container">
      <Routes>
        <Route path="/" element={<SelectFixtureTab />} />
        <Route path="/debug-tool" element={<DebugTab />} />
        <Route path="/matchlive-control" element={<MatchliveControlTab />} />
      </Routes>
    </div>
  );
};

export default ContentsArea;
