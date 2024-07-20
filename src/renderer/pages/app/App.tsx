import Main from './components/Main';
import './App.css';
import { Provider } from 'react-redux';
import store from './store/store';

export default function App() {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
}
