import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Row from './Row';

import '../styles/index.scss';
import { prettyLog } from '../util/prettyLog';
import { algoChoices } from '../util/algoChoices';
import chooseGrid from '../util/chooseGrid';

const metaStarter = () => {
  return {
    current: ``,
    potential: ``,
    visited: new Set(),
    discovered: new Set(),
  };
};

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const App = () => {
  // set vars
  const [currentGrid, setCurrentGrid] = useState<any>([[]]);
  const [algoRunning, setAlgoRunning] = useState<boolean>(false);
  const [currentAlgo, setCurrentAlgo] = useState<any>(false);
  const [startPoint, setStartPoint] = useState<number[]>([0, 0]);
  const [endPoint, setEndPoint] = useState<number[]>([0, 0]);
  const [delay, setDelay] = useState<number>(200);
  const [meta, setMeta] = useState<any>(metaStarter());

  useEffect(() => {
    setCurrentGrid(chooseGrid('maze'));
  }, []);

  useEffect(() => {
    setMeta(() => metaStarter());
  }, [currentGrid]);

  useEffect(() => {
    console.log('algoRunning changed! is now', algoRunning);
    if (algoRunning && currentAlgo) runAlgo();
    else setAlgoRunning(false);
  }, [algoRunning]);

  const updateGrid = async (e: any, row: number, col: number) => {
    const newValue =
      Number(e.target.value) !== Number(e.target.value) ||
      e.target.value !== '0'
        ? e.target.value
        : Number(e.target.value);
    setCurrentGrid((grid: any) => {
      const gridClone = [...grid];
      console.log(gridClone);
      gridClone[row][col] = newValue;
      return [...gridClone];
    });
  };

  /**
   *
   * @param newMeta object with new values for meta state. Sets will use the .add method.
   * @param ms Milliseconds to delay after updating screen.
   */
  const updateScreen = async (newMeta: any, ms: number = delay) => {
    setMeta((meta: any) => {
      const tempObj = { ...meta };
      if (newMeta.visited !== undefined)
        tempObj.visited = meta.visited.add(newMeta.visited);
      if (newMeta.discovered !== undefined)
        tempObj.discovered = meta.discovered.add(newMeta.discovered);
      if (newMeta.potential !== undefined)
        tempObj.potential = newMeta.potential;
      if (newMeta.current !== undefined) tempObj.current = newMeta.current;
      return tempObj;
    });
    if (newMeta.grid !== undefined) {
      console.log(newMeta.grid);
      await updateGrid(
        { target: { value: newMeta.grid[2] } },
        newMeta.grid[0],
        newMeta.grid[1]
      );
    }
    await sleep(ms);
  };

  /**
   * Invoke currentAlgo function and provide it with params from current state
   */
  const runAlgo = async () => {
    setMeta(() => metaStarter());
    await sleep(100);
    currentAlgo(currentGrid, startPoint, updateScreen, setAlgoRunning);
  };

  const handleAlgoSelect = (e: any) => {
    setCurrentAlgo(() => {
      return e.target.value === 'custom'
        ? currentAlgo
        : algoChoices[e.target.value];
    });
  };

  const handleGridSelect = (e: any) => {
    setCurrentGrid(chooseGrid(e.target.value));
  };

  /**
   *
   * Updates currentAlgo with a func generated from user input.
   *
   * Takes user's input and wraps it in a function that returns an async function.
   *
   * We generate the outer function, then invoke it and pass the returned async function as the new currentAlgo.
   */
  const handleCustomFuncBlur = (e: any) => {
    console.log(e.target.value);
    const newFunc = new Function(
      'grid, start=[1,3], updateScreen, shutOff',
      `
      return async (grid, start, updateScreen, shutOff) => { 
        ${e.target.value} \n 
        shutOff(false);
      }`
    );
    const asyncFunc = newFunc();
    setCurrentAlgo(() => asyncFunc);
  };

  return (
    <div id='Main'>
      <Routes>
        <Route
          path='/'
          element={
            <div id='main2'>
              <div className='panel'>
                <button onClick={() => setAlgoRunning(true)}>
                  Run Algorithm
                </button>
                <label>Set Delay</label>
                <input
                  type={'text'}
                  onChange={(e) => {
                    setDelay(Number(e.target.value));
                  }}
                ></input>
                <label>Start Row</label>
                <input
                  type={'text'}
                  onChange={(e) => {
                    setStartPoint((current) => [
                      Number(e.target.value),
                      current[1],
                    ]);
                  }}
                ></input>
                <label>Start Column</label>
                <input
                  type={'text'}
                  onChange={(e) => {
                    setStartPoint((current) => [
                      current[0],
                      Number(e.target.value),
                    ]);
                  }}
                ></input>
                <label>Select Algorithm *</label>

                <select onChange={handleAlgoSelect}>
                  <option></option>
                  {Object.keys(algoChoices).map((el: any, i: number) => {
                    return <option key={i}>{el}</option>;
                  })}
                  <option>custom</option>
                </select>

                <label>Select Grid *</label>
                <select onChange={handleGridSelect}>
                  <option></option>
                  <option>anchor</option>
                  <option>grid1</option>
                  <option>bigEmpty</option>
                  <option>maze</option>
                </select>

                <label>Custom Algorithm</label>
                <span>
                  {'async (grid, startPoint, updateScreen, shutOff) => { '}
                </span>
                <textarea
                  onBlur={handleCustomFuncBlur}
                  defaultValue='alert("Custom function executed!");'
                ></textarea>
              </div>
              <div id='grid'>
                {currentGrid.map((el: any, i: number) => {
                  return (
                    <Row
                      key={i}
                      row={i}
                      cells={el}
                      meta={meta}
                      updateGrid={updateGrid}
                    ></Row>
                  );
                })}
              </div>
            </div>
          }
        />
      </Routes>
    </div>
  );
};
export default App;
