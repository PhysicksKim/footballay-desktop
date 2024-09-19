import ElectronStore from 'electron-store';

const store = new ElectronStore();

/**
 * matchlive window 의 저장된 width, height 값을 가져온다. <br>
 * 저장된 윈도우 사이즈가 없을 경우 기본 윈도우 사이즈를 반환한다. <br>
 * @returns {height: number, width: number}
 */
const getMatchliveWindowSize = async () => {
  const storedHeight = (await store.get('matchlive_window_height')) as number;
  const storedWidth = (await store.get('matchlive_window_width')) as number;
  const height = storedHeight ? storedHeight : 850;
  const width = storedWidth ? storedWidth : 415;
  return { height, width };
};

export { getMatchliveWindowSize };
