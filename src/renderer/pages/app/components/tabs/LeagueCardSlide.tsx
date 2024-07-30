import React, { useRef, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import '@app/styles/tabs/SelectFixtureTab.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@app/store/store';
import fetchLeagueList from '@app/store/slices/leagueSliceThunk';
import fetchFixtureList, {
  FetchFixtureListParams,
} from '@app/store/slices/fixtureListSliceThunk';
import { setDate, setLeagueId } from '@app/store/slices/footballSelectionSlice';

const LeagueCardSlide = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    watchDrag: false,
  });

  const dispatch = useDispatch<AppDispatch>();
  const leagues = useSelector((state: RootState) => state.league.leagues);
  const selectedLeagueId = useSelector(
    (state: RootState) => state.selected.leagueId,
  );
  const fixtureList = useSelector(
    (state: RootState) => state.fixtureList.fixtures,
  );

  useEffect(() => {
    if (leagues.length === 0) {
      dispatch(fetchLeagueList());
    }
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi]);

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  const onSelect = () => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  };

  const handleLeagueClick = (leagueId: number) => {
    dispatch(setDate(new Date().toISOString()));
    dispatch(fetchFixtureList({ leagueId, date: '' }));
    dispatch(setLeagueId(leagueId));
  };

  return (
    <div className="league-box">
      <div className="league-box-title">리그</div>
      <div className="embla" ref={emblaRef}>
        <div className="embla__container league-card-box">
          {leagues.map((league) => (
            <div
              key={league.leagueId}
              className={`embla__slide league-card-item ${
                selectedLeagueId === league.leagueId ? 'selected' : ''
              }`}
              league-id={league.leagueId}
              onClick={() => handleLeagueClick(league.leagueId)}
            >
              <img
                draggable="false"
                className="league-card-item-logo"
                src={league.logo}
                alt={league.name}
              />
              <div className="league-card-item-name">
                {league.koreanName ? league.koreanName : league.name}
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        className="embla__button embla__button--prev"
        onClick={scrollPrev}
        disabled={!prevBtnEnabled}
      >
        {'<'}
      </button>
      <button
        className="embla__button embla__button--next"
        onClick={scrollNext}
        disabled={!nextBtnEnabled}
      >
        {'>'}
      </button>
    </div>
  );
};

export default LeagueCardSlide;
