import React, { useState, useEffect, Fragment } from 'react';
import { Routes, Route } from 'react-router-dom';
import Row from './Row';

import '../styles/index.scss';
import Button from './Button';

// const metaStarter = () => {
//   return {
//     current: ``,
//     potential: ``,
//     visited: new Set(),
//     discovered: new Set(),
//   };
// };

const App = () => {
  // set vars
  const [fullGrid, setFullGrid] = useState<any>([[]]);
  const [algoRunning, setAlgoRunning] = useState<boolean>(false);
  const [meta, setMeta] = useState<any>({
    current: '',
    potential: '',
    visited: new Set(),
    discovered: new Set(),
  });

  useEffect(() => {
    // setFullGrid([
    //   [1, 2, 3],
    //   [4, 5, 6],
    //   [7, 8, 9],
    // ]);
    setFullGrid(
      // [
      //   [0, 0, 1, 0, 0],
      //   [0, 0, 1, 0, 0],
      //   [1, 0, 1, 0, 1],
      //   [1, 1, 1, 1, 1],
      // ]
      // [
      //   [1, 1, 0, 0, 1],
      //   [1, 1, 0, 0, 0],
      //   [0, 0, 1, 0, 0],
      //   [1, 0, 0, 1, 1],
      // ]
      [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ]
    );
  }, []);
  useEffect(() => {
    console.log('algoRunning changed! is now', algoRunning);
    if (algoRunning) runAlgo();
  }, [algoRunning]);

  const updateGrid = (e: any, row: number, col: number) => {
    const newValue = e.target.value;
    const gridClone = [...fullGrid];
    gridClone[row][col] = newValue;
    setFullGrid(gridClone);
  };

  const rows = fullGrid.map((el: any, i: number) => {
    return (
      <Row key={i} row={i} cells={el} meta={meta} updateGrid={updateGrid}></Row>
    );
  });

  const sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const runAlgo1 = async () => {
    // app should also pass a func to update its state
    // we run the func after each loop of this algo, the func updates app state, and everything below it rerenders

    for (let i = 0; i < fullGrid.length; i++) {
      const row = fullGrid[i];
      for (let j = 0; j < row.length; j++) {
        const col = row[j];
        console.log(i, j);

        setMeta({
          ...meta,
          current: `${i}.${j}`,
          visited: meta.visited.add(`${i}.${j}`),
        });
        await sleep(500);
      }
    }

    setAlgoRunning(false);
  };

  const runAlgo2 = async () => {
    // await resetMeta();
    const discovered = new Set();
    let islandCount = 0;

    const findMore = async (i: number, j: number) => {
      console.log(meta);
      console.log({
        ...meta,
        potential: { ...meta.potential, potential: `${i}.${j}` },
      });
      setMeta((meta: any) => {
        return {
          ...meta,
          potential: `${i}.${j}`,
        };
      });
      await sleep(500);
      // if 1 and not yet seen and coordinate is valid, discover it and continue
      if (!discovered.has(`${i}.${j}`) && fullGrid[i] && fullGrid[i][j] === 1) {
        setMeta((meta: any) => {
          return {
            ...meta,
            current: `${i}.${j}`,
            discovered: meta.discovered.add(`${i}.${j}`),
          };
        });
        await sleep(500);
        // add location to saved
        discovered.add(`${i}.${j}`);
        // try up, down, left, right
        await findMore(i - 1, j);
        await findMore(i + 1, j);
        await findMore(i, j - 1);
        await findMore(i, j + 1);
        setMeta((meta: any) => {
          return {
            ...meta,
            potential: '',
          };
        });
        await sleep(500);
      }
    };

    for (let i = 0; i < fullGrid.length; i++) {
      for (let j = 0; j < fullGrid[i].length; j++) {
        // if 1s, check if we've seen it
        setMeta((meta: any) => {
          return {
            ...meta,
            current: `${i}.${j}`,
            visited: meta.visited.add(`${i}.${j}`),
          };
        });
        await sleep(500);
        if (fullGrid[i][j] === 1) {
          // if undiscovered, launch findMore recursion
          if (!discovered.has(`${i}.${j}`)) {
            islandCount++;
            await findMore(i, j);
          }
        }
        setMeta((meta: any) => {
          return {
            ...meta,
            current: `${i}.${j}`,
            visited: meta.visited.add(`${i}.${j}`),
          };
        });
        await sleep(500);
      }
    }
    alert(islandCount);

    setAlgoRunning(false);
  };

  const runAlgo = async () => {
    // app should also pass a func to update its state
    // we run the func after each loop of this algo, the func updates app state, and everything below it rerenders

    // start point
    let r = 4;
    let c = 4;
    // queue
    const queue = [`${r}.${c}`];
    const visited = new Set();

    // while queue not empty
    while (queue.length) {
      // n = dequeue
      let [row, col] = queue.pop().split('.');
      r = Number(row);
      c = Number(col);
      console.log(r, c);
      // for v of n.children, queue.add(v)
      setMeta((meta: any) => {
        return {
          ...meta,
          current: `${r}.${c}`,
          visited: meta.visited.add(`${r}.${c}`),
        };
      });
      await sleep(200);

      // loop through coords
      for (let coordinate of [
        `${r - 1}.${c}`,
        `${r + 1}.${c}`,
        `${r}.${c - 1}`,
        `${r}.${c + 1}`,
      ]) {
        // extract r, c
        let r = Number(coordinate.split('.')[0]);
        let c = Number(coordinate.split('.')[1]);

        if (
          fullGrid[r] &&
          fullGrid[r][c] !== undefined &&
          !visited.has(`${r}.${c}`)
        ) {
          //
          console.log(`${r}.${c}`);
          setMeta((meta: any) => {
            return {
              ...meta,
              // active: `${r}.${c}`,
              visited: meta.visited.add(`${r}.${c}`),
            };
          });
          await sleep(200);
          // add to visited
          visited.add(`${r}.${c}`);
          // unshift to queue
          queue.unshift(`${r}.${c}`);
        }
      }

      // break;
    }

    // look at all children of each child
    // etc...

    setAlgoRunning(false);
  };

  return (
    <div id='Main'>
      <Routes>
        <Route
          path='/'
          element={
            <div className='grid'>
              {rows}
              <Button fullGrid={fullGrid} runAlgo={setAlgoRunning} />
            </div>
          }
        />
      </Routes>
    </div>
  );
};
export default App;
