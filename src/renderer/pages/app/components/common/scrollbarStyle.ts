import styled, { css } from 'styled-components';

export const SCROLLBAR_WIDTH = 7;

export const scrollbarStyle = css`
  &::-webkit-scrollbar {
    width: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #3e4451;
    border-radius: 5px;
  }
  &::-webkit-scrollbar-track {
    background-color: #282c34;
    border-radius: 5px;
  }
`;
