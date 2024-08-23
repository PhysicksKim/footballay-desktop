import React, { useEffect, useRef, useState } from 'react';
import './styles/Body.scss';
import { createGlobalStyle } from 'styled-components';
import Main from './components/Main';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'GmarketSans', 'Pretendard', sans-serif;
  }
`;

const Application = () => {
  return <Main />;
};

export default Application;
