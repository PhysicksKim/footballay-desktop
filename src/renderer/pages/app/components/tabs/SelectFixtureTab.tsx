import React, { useRef, useEffect, useState } from 'react';
import '@app/styles/tabs/SelectFixtureTab.scss';
import FixtureSlideBox from './FixtureSlideBox';
import LeagueCardSlide from './LeagueCardSlide';

const SelectFixtureTab = () => {
  return (
    <div className="select-fixture-tab-container">
      <LeagueCardSlide />
      <FixtureSlideBox />
    </div>
  );
};

export default SelectFixtureTab;

/*

          <div className="embla__container league-card-box">
            <div className="embla__slide league-card-item card_01">
              <img
                draggable="false"
                className="league-card-item-logo card_logo_01"
                src="https://i.namu.wiki/i/75UQs2jmnv_d3sT3PVZaJ_kvRJp_CccmYCFZQpus78aixKNFIP67Z3S6i31bRFdr5D7a150lD-vyThbRt2eE4g5p3R36EYmHlPFWhSRLeSq8v0sBmCSTlXVLkJFKJSjBqSeXxd4YGq_2x0JlEGz3Jg.svg"
              ></img>
              <div className="league-card-item-name card_name_01">
                잉글랜드 프리미어리그
              </div>
            </div>
            <div className="embla__slide league-card-item card_02">
              <img
                draggable="false"
                className="league-card-item-logo card_logo_02"
                src="https://i.namu.wiki/i/pfHziRCo_qLNCcza2BhhNmyFo5XS33m5zVQHAV25-Ty9zXy9uI_LnKzhb8datqG2zt6wjrYlv_Qo8lsiJxH2iFGR0EC6Pm1qPqecS5ZRjCc0UHNGNsYjyUo7aU5qV8Zf6JVYRLETPTAG2Azx1oVkjw.svg"
              ></img>
              <div className="league-card-item-name card_name_02">
                UEFA 챔피언스리그
              </div>
            </div>
            {false && (
              <>
                <div className="embla__slide league-card-item card_01">
                  <img
                    draggable="false"
                    className="league-card-item-logo card_logo_01"
                    src="https://i.namu.wiki/i/75UQs2jmnv_d3sT3PVZaJ_kvRJp_CccmYCFZQpus78aixKNFIP67Z3S6i31bRFdr5D7a150lD-vyThbRt2eE4g5p3R36EYmHlPFWhSRLeSq8v0sBmCSTlXVLkJFKJSjBqSeXxd4YGq_2x0JlEGz3Jg.svg"
                  ></img>
                  <div className="league-card-item-name card_name_01">
                    잉글랜드 프리미어리그
                  </div>
                </div>
                <div className="embla__slide league-card-item card_02">
                  <img
                    draggable="false"
                    className="league-card-item-logo card_logo_02"
                    src="https://i.namu.wiki/i/pfHziRCo_qLNCcza2BhhNmyFo5XS33m5zVQHAV25-Ty9zXy9uI_LnKzhb8datqG2zt6wjrYlv_Qo8lsiJxH2iFGR0EC6Pm1qPqecS5ZRjCc0UHNGNsYjyUo7aU5qV8Zf6JVYRLETPTAG2Azx1oVkjw.svg"
                  ></img>
                  <div className="league-card-item-name card_name_02">
                    UEFA 챔피언스리그
                  </div>
                </div>
              </>
            )}
*/
