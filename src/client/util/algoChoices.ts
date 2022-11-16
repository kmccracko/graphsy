const forfor = async (
  grid: [[]] = [[]],
  start: number[],
  updateScreen: any = () => {},
  shutOff: any = () => {}
) => {
  for (let i = 0; i < grid.length; i++) {
    const row = grid[i];
    for (let j = 0; j < row.length; j++) {
      const col = row[j];

      await updateScreen({
        current: `${i}.${j}`,
      });
    }
  }

  shutOff(false);
};

const CountIslands = async (
  grid: [[]] = [[]],
  start: number[],
  updateScreen: any = () => {},
  shutOff: any = () => {}
) => {
  const discovered = new Set();
  let islandCount = 0;

  const findMore = async (i: number, j: number) => {
    await updateScreen({
      potential: `${i}.${j}`,
    });
    // if 1 and not yet seen and coordinate is valid, discover it and continue
    if (!discovered.has(`${i}.${j}`) && grid[i] && grid[i][j]) {
      await updateScreen({
        current: `${i}.${j}`,
        discovered: `${i}.${j}`,
      });
      // add location to saved
      discovered.add(`${i}.${j}`);
      // try up, down, left, right
      await findMore(i - 1, j);
      await findMore(i + 1, j);
      await findMore(i, j - 1);
      await findMore(i, j + 1);
      await updateScreen({
        potential: `${i}.${j}`,
      });
    }
  };

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      // if 1s, check if we've seen it
      await updateScreen({
        current: `${i}.${j}`,
        visited: `${i}.${j}`,
      });
      if (grid[i][j]) {
        // if undiscovered, launch findMore recursion
        if (!discovered.has(`${i}.${j}`)) {
          islandCount++;
          await findMore(i, j);
        }
      }
      await updateScreen({
        current: `${i}.${j}`,
        visited: `${i}.${j}`,
      });
    }
  }
  alert(islandCount);

  shutOff(false);
};

const BFS = async (
  grid: [[]] = [[]],
  start: number[],
  updateScreen: any = () => {},
  shutOff: any = () => {}
) => {
  // start point
  let [r, c] = start;
  // queue
  const queue = [`${r}.${c}`];
  const visited = new Set();

  // while queue not empty
  while (queue.length) {
    // n = dequeue
    let [row, col] = queue.pop().split('.');
    r = Number(row);
    c = Number(col);

    await updateScreen({
      current: `${r}.${c}`,
      discovered: `${r}.${c}`,
    });

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

      if (grid[r] && grid[r][c] !== undefined && !visited.has(`${r}.${c}`)) {
        //
        await updateScreen({
          visited: `${r}.${c}`,
        });
        // add to visited
        visited.add(`${r}.${c}`);
        // unshift to queue
        queue.unshift(`${r}.${c}`);
      }
    }
  }

  shutOff(false);
};

const DFS = async (
  grid: [[]] = [[]],
  start: number[],
  updateScreen: any = () => {},
  shutOff: any = () => {}
) => {
  const discovered = new Set();

  const findMore = async (i: number, j: number) => {
    await updateScreen({
      potential: `${i}.${j}`,
    });
    // if 1 and not yet seen and coordinate is valid, discover it and continue
    if (!discovered.has(`${i}.${j}`) && grid[i] && grid[i][j] !== undefined) {
      await updateScreen({
        current: `${i}.${j}`,
        discovered: `${i}.${j}`,
      });
      // add location to saved
      discovered.add(`${i}.${j}`);
      // try up, down, left, right
      await findMore(i - 1, j);
      await findMore(i, j + 1);
      await findMore(i + 1, j);
      await findMore(i, j - 1);
      await updateScreen({
        potential: `${i}.${j}`,
      });
    }
  };
  await findMore(start[0], start[1]);

  shutOff(false);
};

const solveMaze = async (
  grid: [[]] = [[]],
  start: number[],
  updateScreen: any = () => {},
  shutOff: any = () => {}
) => {
  async function initMaze(maze) {
    // base case 1 : maze empty
    if (!maze || !maze[0]) return 'Maze is empty!';

    // init constants
    const maxY = maze.length;
    const maxX = maze[0].length;

    return await navigate(maze, maxX, maxY);
  }

  async function navigate(
    maze,
    maxX,
    maxY,
    curX = start[1],
    curY = start[0],
    intersections = [0, { 0: [0, 0] }],
    counter = 0
  ) {
    await updateScreen({
      discovered: `${curY}.${curX}`,
    });
    // base case 2: maze complete!
    if (curX + 1 === maxX && curY + 1 === maxY)
      return `Wahoo! Maze solved. Done in ${counter} steps.`;

    // else, update intersections, pick a direction
    // if no directions available, move to most recent in intersections.
    let choices = await checkDirs(maze, curY, curX, maxY, maxX, 'checking');

    let newY,
      newX = 0;
    if (choices > 0) {
      if (choices > 1) {
        // if multiple options available, add it to list
        // then update using first direction available
        typeof intersections[0] === 'number' && intersections[0]++;
        intersections[1][String(intersections[0])] = [curY, curX];
      }
      // if at least 1 option, take first available
      [newY, newX] = await checkDirs(maze, curY, curX, maxY, maxX, 'go');

      // update new space to counter number
      maze[newY][newX] = String(counter + 1);
    } else {
      // if no options, go back to the most recent intersection, then remove that option

      [newY, newX] = intersections[1][String(intersections[0])];
      delete intersections[1][String(intersections[0])];
      typeof intersections[0] === 'number' && intersections[0]--;
    }

    // base case 3 : dead end, no intersections left
    if (choices === 0 && intersections[0] === 0) {
      return 'Exhausted everything! ' + counter;
    }

    // recurse!
    return navigate(maze, maxX, maxY, newX, newY, intersections, counter + 1);
  }

  async function checkDirs(
    maze,
    curY,
    curX,
    maxY,
    maxX,
    checkType
  ): Promise<any> {
    let choices = 0;

    for (let dir of directions) {
      // if current direction is viable
      if (
        curY + dir[0] < maxY &&
        curY + dir[0] >= 0 &&
        curX + dir[1] < maxX &&
        curX + dir[1] >= 0 &&
        maze[curY + dir[0]][curX + dir[1]] === ''
      ) {
        // if now moving, return when possible
        // increment intersect regardless
        if (checkType === 'go') return [curY + dir[0], curX + dir[1]];
        choices++;
      }
    }
    return choices;
  }

  const directions = [
    [1, 0],
    [0, 1],
    [0, -1],
    [-1, 0],
  ];

  initMaze(grid);

  shutOff(false);
};

const solveMazeBFS = async (
  grid: [[]] = [[]],
  start: number[],
  updateScreen: any = () => {},
  shutOff: any = () => {}
) => {
  // start point
  let [r, c] = start;
  // queue
  const queue = [`${r}.${c}`];
  const visited = new Set();

  // while queue not empty
  while (queue.length) {
    // n = dequeue
    let [row, col] = queue.pop().split('.');
    r = Number(row);
    c = Number(col);

    await updateScreen({
      current: `${r}.${c}`,
      discovered: `${r}.${c}`,
    });

    if (r === grid.length - 1 && c === grid[r].length - 1) break;

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

      if (grid[r] && grid[r][c] !== undefined && !visited.has(`${r}.${c}`)) {
        //
        if (grid[r][c] === 'W') {
          visited.add(`${r}.${c}`);
          continue;
        }

        await updateScreen({
          visited: `${r}.${c}`,
        });
        // add to visited
        visited.add(`${r}.${c}`);
        // unshift to queue
        queue.unshift(`${r}.${c}`);
      }
    }
  }

  shutOff(false);
};

const solveMazeDFS = async (
  grid: [[]] = [[]],
  start: number[],
  updateScreen: any = () => {},
  shutOff: any = () => {}
) => {
  const discovered = new Set();

  const findMore = async (i: number, j: number) => {
    await updateScreen({
      potential: `${i}.${j}`,
    });
    // if 1 and not yet seen and coordinate is valid, discover it and continue
    if (
      !discovered.has(`${i}.${j}`) &&
      grid[i] &&
      grid[i][j] !== undefined &&
      grid[i][j] !== 'W'
    ) {
      await updateScreen({
        current: `${i}.${j}`,
        discovered: `${i}.${j}`,
      });

      if (i === grid.length - 1 && j === grid[i].length - 1) return 'done';

      // add location to saved
      discovered.add(`${i}.${j}`);
      // try up, down, left, right
      if ((await findMore(i - 1, j)) === 'done') return 'done';
      if ((await findMore(i, j + 1)) === 'done') return 'done';
      if ((await findMore(i + 1, j)) === 'done') return 'done';
      if ((await findMore(i, j - 1)) === 'done') return 'done';
      await updateScreen({
        potential: `${i}.${j}`,
      });
    }
  };
  await findMore(start[0], start[1]);

  shutOff(false);
};

const closestCarrot = async (
  grid: [[]] = [[]],
  start: number[],
  updateScreen: any = () => {},
  shutOff: any = () => {}
) => {
  // start point
  let [r, c] = start;
  // queue
  const queue = [{ coord: [r, c], level: 0 }];
  const visited = new Set();
  let shortestPath = -1;

  // while queue not empty
  while (queue.length) {
    // n = dequeue
    let currentCoord = queue.pop();
    [r, c] = currentCoord.coord;
    let currentLevel = currentCoord.level;

    await updateScreen({
      current: `${r}.${c}`,
      discovered: `${r}.${c}`,
    });

    if (grid[r][c] === 'C') {
      shortestPath = currentLevel;
      break;
    }

    // loop through coords
    for (let coordinate of [
      [r - 1, c],
      [r + 1, c],
      [r, c - 1],
      [r, c + 1],
    ]) {
      // extract r, c
      let [r, c] = coordinate;

      if (grid[r] && grid[r][c] !== undefined && !visited.has(`${r}.${c}`)) {
        if (grid[r][c] === 'W') {
          visited.add(`${r}.${c}`);
          continue;
        }
        //
        await updateScreen({
          visited: `${r}.${c}`,
        });
        // add to visited
        visited.add(`${r}.${c}`);
        // unshift to queue
        queue.unshift({ coord: [r, c], level: currentLevel + 1 });
      }
    }
  }
  alert(shortestPath);

  shutOff(false);
};

interface algoChoices {
  [key: string]: Function;
}

export const algoChoices: algoChoices = {
  forfor,
  CountIslands,
  BFS,
  DFS,
  solveMaze,
  solveMazeBFS,
  solveMazeDFS,
  closestCarrot,
};
