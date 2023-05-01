import React, { MouseEventHandler, ChangeEventHandler } from 'react';

import CodeEditor from './CodeSpace';

interface IbuttonProps {
  delay: Number;
  startPoint: Number[];
  endPoint: Number[];
  gridChoice: string;
  algoChoice: string;
  algoChoices: any;
  algoDesc: string;
  customAlgoString: string;
  customGridString: string;
  currentGrid: any[][];
  defaultFill: string;
  handleDelayChange: ChangeEventHandler<HTMLSelectElement>;
  handlePointChange: Function;
  handleGridSelect: ChangeEventHandler<HTMLSelectElement>;
  handleAlgoSelect: ChangeEventHandler<HTMLSelectElement>;
  handleCustomFuncChange: Function;
  handleCustomGridChange: Function;
  handleCreateGrid: MouseEventHandler<HTMLButtonElement>;
  handleGridResize: Function;
  handleDefaultFillChange: ChangeEventHandler<HTMLInputElement>;
}

const PanelOptions = ({
  delay,
  startPoint,
  endPoint,
  gridChoice,
  algoChoice,
  algoChoices,
  algoDesc,
  customAlgoString,
  customGridString,
  currentGrid,
  defaultFill,
  handleDelayChange,
  handlePointChange,
  handleGridSelect,
  handleAlgoSelect,
  handleCustomFuncChange,
  handleCustomGridChange,
  handleCreateGrid,
  handleGridResize,
  handleDefaultFillChange,
}: IbuttonProps) => {
  return (
    <div id='options'>
      <label>Set Delay (ms)</label>
      <select defaultValue={delay.toString()} onChange={handleDelayChange}>
        <option>10</option>
        <option>50</option>
        <option>100</option>
        <option>200</option>
        <option>500</option>
        <option>800</option>
        <option>1000</option>
        <option>2000</option>
      </select>

      <div className='coordinate-set'>
        <label>Start</label>
        <div className='coordinate'>
          <label className='sublabel'>Row</label>
          <input
            type={'text'}
            defaultValue={startPoint[0].toString()}
            onChange={(e) => handlePointChange(0, e.target.value)}
          ></input>
        </div>

        <div className='coordinate'>
          <label className='sublabel'>Column</label>
          <input
            type={'text'}
            defaultValue={startPoint[1].toString()}
            onChange={(e) => handlePointChange(1, e.target.value)}
          ></input>
        </div>
      </div>

      {
        <div className='coordinate-set'>
          <label>End&nbsp;&nbsp;</label>
          <div className='coordinate'>
            <label className='sublabel'>Row</label>
            <input
              type={'text'}
              value={endPoint[0].toString()}
              onChange={(e) => handlePointChange(0, e.target.value, 'e')}
            ></input>
          </div>

          <div className='coordinate'>
            <label className='sublabel'>Column</label>
            <input
              type={'text'}
              value={endPoint[1].toString()}
              onChange={(e) => handlePointChange(1, e.target.value, 'e')}
            ></input>
          </div>
        </div>
      }

      <div id='select-container-outer'>
        <div className='select-container-inner'>
          <label>Select Grid</label>
          <select onChange={handleGridSelect} value={gridChoice}>
            <option>anchor</option>
            <option>grid1</option>
            <option>bigEmpty</option>
            <option>partitions</option>
            <option>maze</option>
            <option>bigmaze</option>
            <option>custom</option>
          </select>
        </div>

        <div className='select-container-inner'>
          <label>Select Algo</label>
          <select onChange={handleAlgoSelect} value={algoChoice}>
            {Object.keys(algoChoices).map((el: any, i: number) => {
              return <option key={i}>{el}</option>;
            })}
          </select>
        </div>
      </div>

      <label>Algorithm</label>
      <span className='elaboration'>{algoDesc}</span>

      <CodeEditor
        code={customAlgoString}
        onChangeCode={handleCustomFuncChange}
      />
      <label>Custom Grid</label>
      <span className='elaboration'>
        JSON or JS code. Must generate a nested array.
      </span>
      <CodeEditor
        code={customGridString}
        onChangeCode={handleCustomGridChange}
      />
      <button onClick={handleCreateGrid}>Create Grid</button>
      <label>Edit Current Grid</label>

      <div className='fl-col'>
        <div className='fl-col'>
          <label className='sublabel'>Adjust Grid Size</label>
          <div className='fl-row fl-center-h'>
            <div className='fl-row grid-adj'>
              <button
                className={`btn-small minus ${
                  currentGrid.length < 2 ? 'inactive' : ''
                }`}
                onClick={() => handleGridResize([-1, 0])}
              >
                - Row
              </button>
              <button
                className='btn-small plus'
                onClick={() => handleGridResize([1, 0])}
              >
                + Row
              </button>
            </div>
            <div className='fl-row grid-adj'>
              <button
                className={`btn-small minus ${
                  currentGrid[0].length < 2 ? 'inactive' : ''
                }`}
                onClick={() => handleGridResize([0, -1])}
              >
                - Col
              </button>
              <button
                className='btn-small plus'
                onClick={() => handleGridResize([0, 1])}
              >
                + Col
              </button>
            </div>
          </div>
        </div>

        <div className='fl-col fl-center-h'>
          <label className='sublabel'>New Cell Fill</label>
          <input
            id='fill-cell'
            type='text'
            value={defaultFill}
            onChange={handleDefaultFillChange}
          ></input>
        </div>
      </div>
    </div>
  );
};
export default PanelOptions;
