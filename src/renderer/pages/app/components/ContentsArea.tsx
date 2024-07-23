import React from 'react';
import { HashRouter, Route, Router, Routes } from 'react-router-dom';
import SelectFixtureTab from './tabs/SelectFixtureTab';

const ContentsArea = () => {
  return (
    <div className="content-area-container">
      <HashRouter>
        <Routes>
          <Route path="/" element={<SelectFixtureTab />} />
        </Routes>
      </HashRouter>
    </div>
  );
};

export default ContentsArea;
