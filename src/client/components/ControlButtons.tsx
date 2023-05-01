import React, { MouseEventHandler } from 'react';

interface IbuttonProps {
  algoRunning: boolean;
  pausedState: boolean;
  handleStart: MouseEventHandler<HTMLButtonElement>;
  handleAbort: MouseEventHandler<HTMLButtonElement>;
  handlePause: MouseEventHandler<HTMLButtonElement>;
}

const ControlButtons = ({
  algoRunning,
  pausedState,
  handleStart,
  handleAbort,
  handlePause,
}: IbuttonProps) => {
  return !algoRunning ? (
    <div id='start-stop-buttons'>
      <button
        id='start-btn'
        className={algoRunning ? 'inactive' : ''}
        onClick={handleStart}
      >
        ▶
      </button>
    </div>
  ) : (
    <div id='start-stop-buttons'>
      <button
        id='stop-btn'
        className={algoRunning ? '' : 'inactive'}
        onClick={handleAbort}
      >
        ⚙
      </button>
      <button
        id='pause-btn'
        className={algoRunning ? '' : 'inactive'}
        onClick={handlePause}
      >
        {pausedState ? '▶' : '❚❚'}
      </button>
    </div>
  );
};
export default ControlButtons;
