import React from 'react';
import '../styles/Body.scss';
import FixtureIpc from '../ipc/FixtureIpc';
import '@matchlive/styles/Body.scss';
import '@matchlive/styles/Main.scss';
import Layout from './Layout';

const Main = () => {
  return (
    <div className="root-container">
      <FixtureIpc />
      <Layout />
    </div>
  );
};

export default Main;
