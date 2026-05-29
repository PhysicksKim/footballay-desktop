import React, {
  useEffect,
  useRef,
  useState,
  Component,
  ErrorInfo,
  ReactNode,
} from 'react';
import './styles/Body.scss';
import { Provider, useSelector } from 'react-redux';
import store, { RootState } from './store/store';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './components/Main';
import { createGlobalStyle } from 'styled-components';
import '@src/renderer/global/style/Fonts.css';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Pretendard', sans-serif;
  }
`;

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            color: '#fff',
            padding: '20px',
            textAlign: 'center',
          }}
        >
          <h2>오류가 발생했습니다</h2>
          <p style={{ marginTop: '10px', fontSize: '14px', opacity: 0.8 }}>
            {this.state.error?.message || '알 수 없는 오류'}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            새로고침
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const Application = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <GlobalStyle />
        <Router>
          <Routes>
            <Route path="/" element={<Main />} />
          </Routes>
        </Router>
      </Provider>
    </ErrorBoundary>
  );
};

export default Application;
