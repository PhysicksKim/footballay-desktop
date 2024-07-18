import React from 'react';
import '../../styles/darg/DragBar.scss';

const DragBar = () => {
  return (
    <div className="top-bar-drag-wrapper dragable">
      <div className="top-bar-container non-dragable">
        <div className="btn-box">
          <button type="button" className="btn btn-close">
            close
          </button>
          <button type="button" className="btn btn-minimize">
            minimize
          </button>
          <button type="button" className="btn btn-maximize">
            maximize
          </button>
        </div>
      </div>
    </div>
  );
};

export default DragBar;
