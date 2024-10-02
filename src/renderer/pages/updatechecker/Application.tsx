import React, { useEffect, useRef, useState } from 'react';
import './Body.scss';
import { createGlobalStyle } from 'styled-components';
import Main from './components/Main';
import '@src/renderer/global/style/Fonts.css';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Pretendard', sans-serif;
  }
`;

const Application = () => {
  return (
    <>
      <GlobalStyle />
      <Main></Main>
    </>
  );
};

export default Application;
