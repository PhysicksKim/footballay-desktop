import React, { useEffect, useRef, useState } from 'react';
import './styles/Body.scss';
import { Provider, useSelector } from 'react-redux';
import store, { RootState } from './store/store';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './components/Main';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'GmarketSans', 'Pretendard', sans-serif;
  }
`;

const Application = () => {
  return (
    <Provider store={store}>
      <GlobalStyle />
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default Application;
