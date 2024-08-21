import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import App from '../renderer/pages/app/App';

describe('App', () => {
  // 전체 테스트를 위해선 electron 관련 객체와 메서드(ex. ipcRenderer)를 mock 해야함
  // mock 이전에 임시로 xit 로 disabled 해둠.
  xit('should render', () => {
    expect(render(<App />)).toBeTruthy();
  });
});
