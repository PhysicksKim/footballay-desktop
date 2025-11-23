import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import useEmblaCarousel from 'embla-carousel-react';
import { AvailableLeagueResponse } from '@app/v1/types/api';

interface V1LeagueSelectorProps {
  leagues: AvailableLeagueResponse[];
  selectedLeagueUid?: string;
  onSelectLeague: (leagueUid: string) => void;
}

const V1LeagueSelector = ({
  leagues,
  selectedLeagueUid,
  onSelectLeague,
}: V1LeagueSelectorProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    watchDrag: true,
    dragFree: true,
  });

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi) return;
    
    const handleResize = () => {
      emblaApi.reInit();
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit();
  }, [emblaApi, leagues]);

  const handleLeagueClick = (leagueUid: string) => {
    if (selectedLeagueUid === leagueUid) return;
    onSelectLeague(leagueUid);
  };

  return (
    <LeagueBox>
      <LeagueBoxTitle>리그</LeagueBoxTitle>
      <EmblaViewport ref={emblaRef}>
        <EmblaContainer>
          {leagues.map((league) => (
            <LeagueCard
              key={league.uid}
              $selected={selectedLeagueUid === league.uid}
              onClick={() => handleLeagueClick(league.uid)}
            >
              <LeagueLogo
                draggable="false"
                src={league.logo}
                alt={league.name}
              />
              <LeagueName>{league.nameKo ?? league.name}</LeagueName>
            </LeagueCard>
          ))}
        </EmblaContainer>
      </EmblaViewport>

      <NavButton
        $direction="prev"
        onClick={scrollPrev}
        disabled={!prevBtnEnabled}
      >
        {'<'}
      </NavButton>
      <NavButton
        $direction="next"
        onClick={scrollNext}
        disabled={!nextBtnEnabled}
      >
        {'>'}
      </NavButton>
    </LeagueBox>
  );
};

export default V1LeagueSelector;

const LeagueBox = styled.div`
  position: relative;
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  box-sizing: border-box;
  padding: 10px 40px 10px 30px;
`;

const LeagueBoxTitle = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-top: 5px;
  margin-left: 10px;
  color: white;
`;

const EmblaViewport = styled.div`
  overflow: hidden;
  width: 100%;
  min-width: 0;
  margin-top: 15px;
`;

const EmblaContainer = styled.div`
  display: flex;
  user-select: none;
  -webkit-touch-callout: none;
`;

const LeagueCard = styled.div<{ $selected: boolean }>`
  flex: 0 0 auto;
  min-width: 145px;
  height: 100px;
  width: 145px;
  margin-right: 10px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.13s;
  background-color: ${({ $selected }) =>
    $selected ? 'rgba(151, 176, 245, 0.35)' : 'rgba(255, 255, 255, 0.15)'};

  &:hover {
    background-color: ${({ $selected }) =>
      $selected ? 'rgba(124, 156, 204, 0.20)' : 'rgba(255, 255, 255, 0.20)'};
  }

  box-shadow: ${({ $selected }) =>
    $selected ? 'inset 0 0 0 3px rgba(59, 119, 209, 0.5)' : ''};
`;

const LeagueLogo = styled.img`
  width: 100px;
  height: 45px;
  object-fit: contain;
  margin-bottom: 10px;
  margin-top: 5px;
`;

const LeagueName = styled.div`
  white-space: nowrap;
  font-size: 14px;
  color: white;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  padding: 0 5px;
`;

const NavButton = styled.button<{ $direction: 'prev' | 'next' }>`
  position: absolute;
  top: 60%;
  transform: translateY(-50%);
  ${({ $direction }) => ($direction === 'prev' ? 'left: 0;' : 'right: 0;')}
  background-color: rgba(178, 184, 190, 0.274);
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  z-index: 1;
  border-radius: 50%;

  &:disabled {
    opacity: 0.12;
    cursor: not-allowed;
  }

  ${({ $direction }) =>
    $direction === 'prev' ? 'left: -10px;' : 'right: 0px;'}
`;
