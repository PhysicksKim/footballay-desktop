import { useDispatch } from 'react-redux';
import fetchFixtureInfo from '../../store/slices/fixtureSliceThunk';
import { AppDispatch } from '../../store/store';

const FixtureDataManager = () => {
  const dispatch = useDispatch<AppDispatch>();

  const handleFetchData = () => {
    dispatch(fetchFixtureInfo(1232551)); // fixtureId는 필요에 따라 변경
  };

  return (
    <div>
      <button onClick={handleFetchData}>Fetch Fixture Data</button>
    </div>
  );
};

export default FixtureDataManager;
