import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Row from './Row';

import '../styles/index.scss';
import { prettyLog } from '../util/prettyLog';
import { algoChoices } from '../util/algoChoices';
import chooseGrid from '../util/chooseGrid';
import CodeEditor from './CodeSpace';
import VarContainer from './varTracking/VarContainer';

const metaStarter = () => {
  return {
    current: ``,
    potential: ``,
    visited: new Set(),
    discovered: new Set(),
    varObj: {},
  };
};

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

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
    if (algoRunning && algoChoice) runAlgo();
    else setAlgoRunning(false);
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

  /**
   * Checks algoRunning state
   * @returns T/F for "shouldAbort"
   */
  const checkForAbort = () => {
    let shouldAbort = false;
    // console.log(shouldAbort);
    setAlgoRunning((keepRunning) => {
      if (!keepRunning) shouldAbort = true;
      return keepRunning;
    });
    if (shouldAbort) return true;
    else return false;
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
    if (checkForAbort()) return 1;
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
      startPoint,
      endPoint,
      updateScreen,
      updateVars,
      setAlgoRunning,
      resetKey
    );
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
        'grid, start=[0,0], end, updateScreen, updateVars, shutOff, resetKey',
        `
        return async (grid, start, end, updateScreen, updateVars, shutOff, resetKey) => { 
          ${algoString} \n 
          // shutOff(false);
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

  return (
    <div id='Main'>
      <Routes>
        <Route
          path='/'
          element={
            <div id='main2'>
              <div id='panel'>
                <h1>Graphsy</h1>
                <div id='start-stop-buttons'>
                  <button
                    id='start-btn'
                    className={algoRunning ? 'inactive' : ''}
                    onClick={() => setAlgoRunning(true)}
                  >
                    Run
                  </button>
                  <button
                    id='stop-btn'
                    className={algoRunning ? '' : 'inactive'}
                    onClick={() => setAlgoRunning(false)}
                  >
                    Edit
                  </button>
                </div>
                {!algoRunning ? (
                  <div id='options'>
                    <label>Set Delay (ms)</label>
                    <select
                      defaultValue={delay}
                      onChange={(e) => {
                        setDelay(Number(e.target.value));
                      }}
                    >
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
                          defaultValue={startPoint[0]}
                          onChange={(e) => {
                            setStartPoint((current) => [
                              Number(e.target.value),
                              current[1],
                            ]);
                          }}
                        ></input>
                      </div>

                      <div className='coordinate'>
                        <label className='sublabel'>Column</label>
                        <input
                          type={'text'}
                          defaultValue={startPoint[1]}
                          onChange={(e) => {
                            setStartPoint((current) => [
                              current[0],
                              Number(e.target.value),
                            ]);
                          }}
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
                            value={endPoint[0]}
                            onChange={(e) => {
                              setEndPoint((current) => [
                                Number(e.target.value),
                                current[1],
                              ]);
                            }}
                          ></input>
                        </div>

                        <div className='coordinate'>
                          <label className='sublabel'>Column</label>
                          <input
                            type={'text'}
                            value={endPoint[1]}
                            onChange={(e) => {
                              setEndPoint((current) => [
                                current[0],
                                Number(e.target.value),
                              ]);
                            }}
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
                          {Object.keys(algoChoices).map(
                            (el: any, i: number) => {
                              return <option key={i}>{el}</option>;
                            }
                          )}
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
                ) : (
                  <VarContainer vars={meta.varObj} />
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
