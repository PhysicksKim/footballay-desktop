import styled, { css } from 'styled-components';

export const SCROLLBAR_WIDTH = 7;

export const scrollbarStyle = css`
  &::-webkit-scrollbar {
    width: ${SCROLLBAR_WIDTH}px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #cddef5;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #8ba4c5;
  }
`;

/* 사용 예시 */
const EXAMPLE_USAGE = styled.div`
  overflow-x: hidden;
  overflow-y: auto;

  padding-left: ${SCROLLBAR_WIDTH}px;
  padding-right: ${SCROLLBAR_WIDTH}px;

  transform: translate(${SCROLLBAR_WIDTH / 2}px, 0);
  ${scrollbarStyle}
`;
