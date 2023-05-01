import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import Row from './Row';

import '../styles/index.scss';
import { metaStarter } from '../util/metaStarter';
import { sleep } from '../util/sleep';
import { prettyLog } from '../util/prettyLog';
import { algoChoices } from '../util/algoChoices';
import chooseGrid from '../util/chooseGrid';
import VarContainer from './varTracking/VarContainer';
import ControlButtons from './ControlButtons';
import PanelOptions from './PanelOptions';
import LogContainer from './varTracking/LogContainer';

// key for use in resetting meta sets. ensures no accidental resets
const resetKey = Symbol('RESET');

const App = () => {
  // set vars
  const [customAlgoString, setCustomAlgoString] = useState<string>('');
  const [customGridString, setCustomGridString] = useState<string>(
    '[[1,2,3],[4,5,6],[7,8,9]]'
  );
  const [defaultFill, setDefaultFill] = useState<string>('');

  const [algoChoice, setAlgoChoice] = useState<string>('nestedForLoop');
  const [algoDesc, setAlgoDesc] = useState<string>('');
  const [gridChoice, setGridChoice] = useState<string>('maze');
  const [currentGrid, setCurrentGrid] = useState<any[][]>([[]]);
  const [algoRunning, setAlgoRunning] = useState<boolean>(false);
  const [startPoint, setStartPoint] = useState<number[]>([0, 0]);
  const [endPoint, setEndPoint] = useState<number[]>([0, 0]);
  const [delay, setDelay] = useState<number>(10);
  const [meta, setMeta] = useState<any>(metaStarter());
  const [pausedState, setPausedState] = useState<boolean>(false);

  let stopStatus = useRef({ isPaused: 1, isAborted: 1 });

  useEffect(() => {
    if (gridChoice !== 'custom') setCurrentGrid(chooseGrid(gridChoice));
  }, [gridChoice]);

  useEffect(() => {
    let { func, desc } = algoChoices[algoChoice];
    setCustomAlgoString(func);
    setAlgoDesc(desc);
  }, [algoChoice]);

  useEffect(() => {
    setEndPoint([currentGrid.length - 1, currentGrid[0].length - 1]);
    if (!algoRunning) setMeta(() => metaStarter());
  }, [currentGrid]);

  useEffect(() => {
    console.log('algoRunning changed! is now', algoRunning);
    if (algoRunning && algoChoice) {
      stopStatus.current.isAborted = 0;
      stopStatus.current.isPaused = 0;
      runAlgo();
    } else {
      stopStatus.current.isAborted = 1;
      stopStatus.current.isPaused = 1;
      setAlgoRunning(false);
    }
  }, [algoRunning]);

  /**
   * Updates the grid's value at a given coordinate
   *
   * @param e event object, e.target.value is new value
   * @param row row of grid (number)
   * @param col column of grid (number)
   */
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

  const checkForAbort = () => {
    if (stopStatus.current.isAborted) {
      setAlgoRunning(false);
      return true;
    }
  };

  const checkForPause = async () => {
    while (stopStatus.current.isPaused) {
      if (stopStatus.current.isPaused) {
        setPausedState(true);
        if (checkForAbort()) return true;
        console.log('paused...');
        await sleep(200);
      }
    }
    setPausedState(false);
  };

  /**
   *
   * @param newMeta object with new values for meta state. Sets will use the .add method.
   * @param ms Milliseconds to delay after updating screen.
   */
  const updateScreen = async (newMeta: any, ms: number = delay) => {
    // check if we should abort, if yes returns 1
    // if "await updateScreen({...})" ever returns 1,
    // the executing function should try to complete itself however it can
    if (checkForAbort()) return true;
    await checkForPause();

    // updates meta object to inform classes
    setMeta((meta: any) => {
      const tempObj = { ...meta };

      // update visited if key exists. if resetKey passed, reset visited
      // if resetKey, shape should be key: [resetKey, newSetValue] where newSetValue must be a set
      if (newMeta.visited !== undefined) {
        if (newMeta.visited.length && newMeta.visited[0] === resetKey)
          tempObj.visited = newMeta.visited[1];
        else tempObj.visited = meta.visited.add(newMeta.visited);
      }

      // update discovered if key exists. if resetKey passed, reset discovered
      // if resetKey, shape should be key: [resetKey, newSetValue] where newSetValue must be a set
      if (newMeta.discovered !== undefined) {
        if (newMeta.discovered.length && newMeta.discovered[0] === resetKey)
          tempObj.discovered = newMeta.discovered[1];
        else tempObj.discovered = meta.discovered.add(newMeta.discovered);
      }

      // update potential if key exists
      if (newMeta.potential !== undefined)
        tempObj.potential = newMeta.potential;

      // update current if key exists
      if (newMeta.current !== undefined) tempObj.current = newMeta.current;
      return tempObj;
    });

    // updates grid values if passed
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
   *
   * @param newVarObj Object with key of var name and var value
   * @param ms Delay time. Global delay unless specified
   * @returns
   */
  const updateVars = async (newVarObj, ms: number = delay) => {
    if (checkForAbort()) return true;
    await checkForPause();

    // updates var object to inform var container
    setMeta((meta: any) => {
      const [varKey, newValue] = Object.entries(newVarObj)[0];
      const tempMeta = { ...meta };
      const tempVarObj = { ...tempMeta.varObj };

      tempVarObj[varKey] = newValue;

      // if a key exists, it will be updated
      // else it will be created
      tempMeta.varObj = tempVarObj;
      return tempMeta;
    });
    await sleep(ms);
  };

  const updateLogs = async (...args) => {
    if (checkForAbort()) return true;
    await checkForPause();

    const [label, content] = args;

    // updates var object to inform var container
    setMeta((meta: any) => {
      const tempMeta = { ...meta };
      const tempLogArr = [...tempMeta.logArr];

      const newLog = [];
      newLog.push(label);
      if (args.length > 1) newLog.push(content);
      tempLogArr.push(newLog);

      tempMeta.logArr = tempLogArr;
      return tempMeta;
    });
    await sleep(delay);
  };

  /**
   * Invoke currentAlgo function and provide it with params from current state
   */
  const runAlgo = async () => {
    const func = buildAlgo(customAlgoString);

    setMeta(() => metaStarter());
    await sleep(100);

    if (!func) return setAlgoRunning(false);
    func(
      currentGrid,
      startPoint.map((n) => Number(n)),
      endPoint.map((n) => Number(n)),
      updateScreen,
      updateVars,
      updateLogs,
      resetKey
    );
  };

  /**
   *
   * Updates currentAlgo with a func generated from user input.
   *
   * Takes user's input and wraps it in a function that returns an async function.
   *
   * We generate the outer function, then invoke it and pass the returned async function as the new currentAlgo.
   */
  const buildAlgo = (algoString: string) => {
    console.log(algoString);
    let newFunc;
    try {
      newFunc = new Function(
        'grid, start=[0,0], end, updateScreen, updateVars, log, resetKey',
        `
        return async (grid, start, end, updateScreen, updateVars, log, resetKey) => { 
          ${algoString}
        }`
      );
    } catch (err) {
      console.log(err);
      alert(
        'Could not generate algorithm. Aborting. Check console for details'
      );
      return newFunc;
    }
    const asyncFunc = newFunc();
    return asyncFunc;
  };

  // control button functions
  const handleStart = () => setAlgoRunning(true);
  const handleAbort = () => {
    stopStatus.current.isAborted ^= 1;
    setAlgoRunning(false);
  };
  const handlePause = () => (stopStatus.current.isPaused ^= 1);

  // options functions
  const handleDelayChange = (e) => setDelay(Number(e.target.value));
  const handlePointChange = (pos, value, type) => {
    let [point, setter] = [startPoint, setStartPoint];
    if (type === 'e') [point, setter] = [endPoint, setEndPoint];
    const newArr = [...point];
    newArr[pos] = value;
    setter(newArr);
  };
  const handleAlgoSelect = (e: any) => {
    setAlgoChoice(e.target.value);
    handleCustomFuncChange(algoChoices[e.target.value].func);
  };
  const handleGridSelect = (e: any) => {
    setGridChoice(e.target.value);
  };
  const handleDefaultFillChange = (e: any) => {
    setDefaultFill(e.target.value);
  };
  const handleCustomFuncChange = (newValue: string) => {
    setCustomAlgoString(newValue);
  };
  const handleCustomGridChange = (newValue: string) => {
    const cleanStr = newValue.replaceAll("'", '"');
    console.log(cleanStr);
    setCustomGridString(cleanStr);
  };
  const handleCreateGrid = () => {
    if (gridChoice !== 'custom') return;

    let parsedGrid;

    // try to parse json, then try to eval
    try {
      parsedGrid = JSON.parse(customGridString);
    } catch (err) {
      // if not json, try to use eval
      try {
        parsedGrid = eval(customGridString);
      } catch (err) {
        // if eval fails, give give both errors?
        console.log(err);
        return alert('Could not generate grid. Check console for details.');
      }
    }
    // verify this is an array
    if (!Array.isArray(parsedGrid)) {
      alert('Input is not an array. Aborting.');
      return;
    }
    // verify row lengths all match
    let firstLen = parsedGrid[0].length;
    for (let row of parsedGrid) {
      if (row.length !== firstLen)
        alert('Warning: This grid has rows of inequal length.');
    }
    setCurrentGrid(parsedGrid);
  };
  const handleGridResize = (adjustments: [number, number]) => {
    let [rowChange, colChange] = adjustments;

    let newGrid;
    if (rowChange) {
      if (rowChange > 0) {
        newGrid = [
          ...currentGrid,
          Array(currentGrid[0].length).fill(defaultFill),
        ];
      } else if (currentGrid.length > 1) {
        newGrid = currentGrid.slice(0, -1);
      } else return;
    } else {
      if (colChange < 0 && currentGrid[0].length < 2) return;
      newGrid = currentGrid.reduce((acc, cur) => {
        if (colChange > 0) return [...acc, [...cur, defaultFill]];
        else return [...acc, cur.slice(0, -1)];
      }, []);
    }
    setCurrentGrid(newGrid);
  };

  return (
    <div id='Main'>
      <Routes>
        <Route
          path='/'
          element={
            <div id='main2'>
              <div id='panel'>
                <h1>Graphsy</h1>
                <ControlButtons
                  algoRunning={algoRunning}
                  pausedState={pausedState}
                  handleStart={handleStart}
                  handleAbort={handleAbort}
                  handlePause={handlePause}
                />
                {!algoRunning ? (
                  <PanelOptions
                    delay={delay}
                    startPoint={startPoint}
                    endPoint={endPoint}
                    gridChoice={gridChoice}
                    algoChoice={algoChoice}
                    algoChoices={algoChoices}
                    algoDesc={algoDesc}
                    customAlgoString={customAlgoString}
                    customGridString={customGridString}
                    currentGrid={currentGrid}
                    defaultFill={defaultFill}
                    handleDelayChange={handleDelayChange}
                    handlePointChange={handlePointChange}
                    handleGridSelect={handleGridSelect}
                    handleAlgoSelect={handleAlgoSelect}
                    handleCustomFuncChange={handleCustomFuncChange}
                    handleCustomGridChange={handleCustomGridChange}
                    handleCreateGrid={handleCreateGrid}
                    handleGridResize={handleGridResize}
                    handleDefaultFillChange={handleDefaultFillChange}
                  />
                ) : (
                  <div id='panel-alt'>
                    <VarContainer vars={meta.varObj} />
                    <LogContainer logs={meta.logArr} />
                  </div>
                )}
                <a
                  className='social-link'
                  href='https://github.com/kmccracko/graph-traverse'
                  target={'blank'}
                >
                  Check out this project on Github
                </a>
              </div>
              <div
                id='grid'
                style={{
                  gridTemplateRows: `repeat(${currentGrid.length},${
                    currentGrid.length > currentGrid[0].length
                      ? Math.round(100 / currentGrid.length)
                      : Math.round(100 / currentGrid[0].length)
                  }%)`,
                }}
              >
                {currentGrid.map((el: any, i: number) => {
                  return (
                    <Row
                      size={
                        currentGrid.length > currentGrid[0].length
                          ? Math.round(100 / currentGrid.length)
                          : Math.round(100 / currentGrid[0].length)
                      }
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
