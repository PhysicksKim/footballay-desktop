import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './components/Main';
import './App.css';
import { Provider } from 'react-redux';
import store from './store/store';

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
        </Routes>
      </Router>
    </Provider>
  );
}
