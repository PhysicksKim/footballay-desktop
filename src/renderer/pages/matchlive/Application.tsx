import React, { useEffect, useRef, useState } from 'react';
import './Body.scss';
import { Provider, useSelector } from 'react-redux';
import store, { RootState } from './store/store';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './components/Main';

const Application = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default Application;
