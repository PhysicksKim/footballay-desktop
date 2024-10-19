import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@matchlive/store/store';
import { setTeamColors } from '@matchlive/store/slices/teamColorSlice';

const TeamColorProcessor = () => {
  const dispatch = useDispatch();
  const teamInfo = useSelector((state: RootState) => state.fixture.info);

  useEffect(() => {
    if (teamInfo && teamInfo.home && teamInfo.away) {
      const { home, away } = teamInfo;
      dispatch(setTeamColors({ homeId: home.id, awayId: away.id }));
    }
  }, [teamInfo, teamInfo?.home.id, teamInfo?.away.id, dispatch]);

  return <></>;
};

export default TeamColorProcessor;
