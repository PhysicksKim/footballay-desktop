import Main from './components/Main';
import './App.scss';
import { Provider } from 'react-redux';
import store from './store/store';
import { createGlobalStyle } from 'styled-components';
import '@src/renderer/global/style/Fonts.css';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Pretendard', sans-serif;
  }
`;

export default function App() {
  return (
    <>
      <GlobalStyle />
      <Provider store={store}>
        <Main />
      </Provider>
    </>
  );
}
