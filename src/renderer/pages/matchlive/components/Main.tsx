import React, { useEffect, useRef, useState } from 'react';
import '../styles/Body.scss';
import FixtureIpc from '../ipc/FixtureIpc';
import LineupTab from './tabs/lineup/LineupTab';
import '@matchlive/styles/Body.scss';
import '@matchlive/styles/Main.scss';

const Main = () => {
  return (
    <div className="root-container">
      <>
        <FixtureIpc />
      </>
      <div className="contents-area">
        <LineupTab />
      </div>
    </div>
  );
};

export default Main;
