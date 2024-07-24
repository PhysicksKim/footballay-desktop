import React from 'react';
import { HashRouter, Route, Router, Routes } from 'react-router-dom';
import SelectFixtureTab from './tabs/SelectFixtureTab';
import DebugTab from './tabs/DebugTab';

const ContentsArea = () => {
  return (
    <div className="content-area-container">
      <Routes>
        <Route path="/" element={<SelectFixtureTab />} />
        <Route path="/debug-tool" element={<DebugTab />} />
      </Routes>
    </div>
  );
};

export default ContentsArea;
