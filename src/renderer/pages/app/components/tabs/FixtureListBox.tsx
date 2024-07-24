import React from 'react';
import '@app/styles/tabs/FixtureListBox.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import FixtureListItem from './FixtureListItem';

const FixtureListBox = () => {
  return (
    <div className="fixture-list-box-container">
      <div className="fixture-list-box">
        <FixtureListItem />
        <div className="fixture-list-item fixture-list-itme_2">item2</div>
        <div className="fixture-list-item fixture-list-itme_3">item3</div>
      </div>
    </div>
  );
};

export default FixtureListBox;
