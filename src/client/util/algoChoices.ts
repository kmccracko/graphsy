const nestedForLoop = {
  func: `
for (let i = start[0]; i < grid.length; i++) {
  for (let j = start[1]; j < grid[i].length; j++) {
    if (
      await updateScreen({
        current: \`\${i}.\${j}\`,
      })
    )
      return;
  }
}`,
  desc: 'Uses nested for loops to iterate through array. Ignores walls ("W").',
};

const nestedForLoopWithVars = {
  func: `
const arr = []
let counter = 0

// set order of vars in panel (if we want)
updateVars({counter})
updateVars({arr})

for (let r = 0; r < grid.length; r++) {
  for (let c = 0; c < grid[r].length; c++) {

    // update vars in code
    counter++
    arr.push(\`\${r}.\${c}\`)

    // update tracked vars in panel
    updateVars({arr})
    updateVars({counter})

    // update screen visuals, update grid value
    await updateScreen({discovered:\`\${r}.\${c}\`})

    // log something to panel
    if (counter % 5 === 0) await log(\`\${counter} divisible by 5 :)\`)
    if (counter % 14 === 0) await log('Div by 14', \`\${counter} divisible by 14 :)\`)
  }
}`,
  desc: 'Uses nested for loops to iterate through array. Ignores walls ("W"). Tracks variables of interest and writes logs.',
};

const countIslands = {
  func: `
const discovered = new Set();
let islandCount = 0;

const findMore = async (i, j) => {
  if (
    await updateScreen({
      potential: \`\${i}.\${j}\`,
    })
  )
    return 'abort';
  // if 1 and not yet seen and coordinate is valid, discover it and continue
  if (!discovered.has(\`\${i}.\${j}\`) && grid[i] && grid[i][j]) {
    await updateScreen({
      current: \`\${i}.\${j}\`,
      discovered: \`\${i}.\${j}\`,
    });
    // add location to saved
    discovered.add(\`\${i}.\${j}\`);
    // try up, down, left, right
    if ((await findMore(i - 1, j)) === 'abort') return;
    if ((await findMore(i + 1, j)) === 'abort') return;
    if ((await findMore(i, j - 1)) === 'abort') return;
    if ((await findMore(i, j + 1)) === 'abort') return;
    await updateScreen({
      potential: \`\${i}.\${j}\`,
    });
  }
};

for (let i = start[0]; i < grid.length; i++) {
  for (let j = start[1]; j < grid[i].length; j++) {
    if (
      await updateScreen({
        current: \`\${i}.\${j}\`,
        potential: \`\`,
        visited: \`\${i}.\${j}\`,
      })
    )
      return;

    // if 1s, check if we've seen it
    if (grid[i][j]) {
      // if undiscovered, launch findMore recursion
      if (!discovered.has(\`\${i}.\${j}\`)) {
        islandCount++;
        await findMore(i, j);
      }
    }
    await updateScreen({
      current: \`\${i}.\${j}\`,
      visited: \`\${i}.\${j}\`,
    });
  }
}
alert(islandCount);`,
  desc: 'Uses depth-first recursion to traverse islands (groups of consecutive 1s) entirely when found. Ignores walls ("W").',
};

const BFS_breadthFirst = {
  func: `
// start point
let [r, c] = start;
// queue
const queue = [\`\${r}.\${c}\`];
const visited = new Set();

// while queue not empty
while (queue.length) {
  // n = dequeue
  let [row, col] = queue.pop().split('.');
  r = Number(row);
  c = Number(col);

  if (
    await updateScreen({
      current: \`\${r}.\${c}\`,
      discovered: \`\${r}.\${c}\`,
    })
  )
    return;

  // loop through coords
  for (let coordinate of [
    \`\${r - 1}.\${c}\`,
    \`\${r + 1}.\${c}\`,
    \`\${r}.\${c - 1}\`,
    \`\${r}.\${c + 1}\`,
  ]) {
    // extract r, c
    let r = Number(coordinate.split('.')[0]);
    let c = Number(coordinate.split('.')[1]);

    if (grid[r] && grid[r][c] !== undefined && !visited.has(\`\${r}.\${c}\`)) {
      //
      await updateScreen({
        visited: \`\${r}.\${c}\`,
      });
      // add to visited
      visited.add(\`\${r}.\${c}\`);
      // unshift to queue
      queue.unshift(\`\${r}.\${c}\`);
    }
  }
}`,
  desc: 'Breadth-first Search. Uses a queue. Traverses everything, ignores walls ("W").',
};

const DFS_depthFirst = {
  func: `
const discovered = new Set();

const findMore = async (i, j) => {
  if (
    await updateScreen({
      potential: \`\${i}.\${j}\`,
    })
  )
    return 'abort';
  // if 1 and not yet seen and coordinate is valid, discover it and continue
  if (!discovered.has(\`\${i}.\${j}\`) && grid[i] && grid[i][j] !== undefined) {
    await updateScreen({
      current: \`\${i}.\${j}\`,
      discovered: \`\${i}.\${j}\`,
    });
    // add location to saved
    discovered.add(\`\${i}.\${j}\`);
    // try up, down, left, right
    if ((await findMore(i - 1, j)) === 'abort') return 'abort';
    if ((await findMore(i, j + 1)) === 'abort') return 'abort';
    if ((await findMore(i + 1, j)) === 'abort') return 'abort';
    if ((await findMore(i, j - 1)) === 'abort') return 'abort';
    await updateScreen({
      potential: \`\${i}.\${j}\`,
    });
  }
};
await findMore(start[0], start[1]);`,
  desc: 'Depth-first Search. Uses recursion stacks. Traverses everything, ignores walls ("W").',
};

const solveMazeBFS = {
  func: `
// start point
let [r, c] = start;
// queue
const queue = [\`\${r}.\${c}\`];
const visited = new Set();

// while queue not empty
while (queue.length) {
  // n = dequeue
  let [row, col] = queue.pop().split('.');
  r = Number(row);
  c = Number(col);

  if (
    await updateScreen({
      current: \`\${r}.\${c}\`,
      discovered: \`\${r}.\${c}\`,
    })
  )
    return;

  if (r === end[0] && c === end[1]) break;

  // loop through coords
  for (let coordinate of [
    \`\${r - 1}.\${c}\`,
    \`\${r + 1}.\${c}\`,
    \`\${r}.\${c - 1}\`,
    \`\${r}.\${c + 1}\`,
  ]) {
    // extract r, c
    let r = Number(coordinate.split('.')[0]);
    let c = Number(coordinate.split('.')[1]);

    if (grid[r] && grid[r][c] !== undefined && !visited.has(\`\${r}.\${c}\`)) {
      //
      if (grid[r][c] === 'W') {
        visited.add(\`\${r}.\${c}\`);
        continue;
      }

      await updateScreen({
        visited: \`\${r}.\${c}\`,
      });
      // add to visited
      visited.add(\`\${r}.\${c}\`);
      // unshift to queue
      queue.unshift(\`\${r}.\${c}\`);
    }
  }
}`,
  desc: 'Solves a maze using naive Breadth-first Search. Endpoint required. Walls ("W") matter.',
};

const solveMazeDFS = {
  func: `
const discovered = new Set();

const findMore = async (i, j) => {
  if (
    await updateScreen({
      potential: \`\${i}.\${j}\`,
    })
  )
    return 'done';
  // if 1 and not yet seen and coordinate is valid, discover it and continue
  if (
    !discovered.has(\`\${i}.\${j}\`) &&
    grid[i] &&
    grid[i][j] !== undefined &&
    grid[i][j] !== 'W'
  ) {
    await updateScreen({
      current: \`\${i}.\${j}\`,
      discovered: \`\${i}.\${j}\`,
    });

    if (i === end[0] && j === end[1]) return 'done';

    // add location to saved
    discovered.add(\`\${i}.\${j}\`);
    // try up, down, left, right
    if ((await findMore(i - 1, j)) === 'done') return 'done';
    if ((await findMore(i, j + 1)) === 'done') return 'done';
    if ((await findMore(i + 1, j)) === 'done') return 'done';
    if ((await findMore(i, j - 1)) === 'done') return 'done';
    await updateScreen({
      potential: \`\${i}.\${j}\`,
    });
  }
};
await findMore(start[0], start[1]);`,
  desc: 'Solves a maze using naive Depth-first Search. Endpoint required. Walls ("W") matter.',
};

const closestCarrot = {
  func: `
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

  if (
    await updateScreen({
      current: \`\${r}.\${c}\`,
      discovered: \`\${r}.\${c}\`,
    })
  )
    return;

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

    if (grid[r] && grid[r][c] !== undefined && !visited.has(\`\${r}.\${c}\`)) {
      if (grid[r][c] === 'W') {
        visited.add(\`\${r}.\${c}\`);
        continue;
      }
      //
      await updateScreen({
        visited: \`\${r}.\${c}\`,
      });
      // add to visited
      visited.add(\`\${r}.\${c}\`);
      // unshift to queue
      queue.unshift({ coord: [r, c], level: currentLevel + 1 });
    }
  }
}
alert(shortestPath);`,
  desc: 'Finds the closest "C" using Breadth-first Search and returns shortest path to it. Walls ("W") matter.',
};

interface algoChoice {
  func: string;
  desc: string;
}
interface algoChoices {
  [key: string]: algoChoice;
}

export const algoChoices: algoChoices = {
  nestedForLoop,
  nestedForLoopWithVars,
  countIslands,
  BFS_breadthFirst,
  DFS_depthFirst,
  solveMazeBFS,
  solveMazeDFS,
  closestCarrot,
};
