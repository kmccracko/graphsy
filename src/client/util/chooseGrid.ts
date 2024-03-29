/**
 *
 * @param gridName The name of the grid
 * @returns A 2D grid
 */
function chooseGrid(gridName: string): any[][] {
  switch (gridName) {
    case 'anchor':
      return [
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [1, 0, 1, 0, 1],
        [1, 1, 1, 1, 1],
      ];
    case 'grid1':
      return [
        [1, 1, 0, 0, 1],
        [1, 1, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [1, 0, 0, 1, 1],
      ];
    case 'bigEmpty':
      return [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ];
    case 'maze':
      return [
        ['', 'W', '', '', '', '', '', '', '', ''],
        ['', 'W', '', 'W', '', 'W', 'W', 'W', 'W', ''],
        ['', '', '', 'W', '', 'W', '', '', '', ''],
        ['', 'W', '', '', 'W', '', '', 'W', '', 'W'],
        ['', 'W', 'W', 'W', '', 'W', '', 'W', 'W', 'W'],
        ['', '', '', '', '', 'W', '', '', '', ''],
      ];
    case 'bigmaze':
      return [
  [' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ',' ','W',' '],
  ['W',' ',' ','W',' ','W',' ','W','W',' ','W','W','W',' ','W','W','W',' ','W','W','W','W','W','W',' ','W',' '],
  [' ',' ','W','W',' ','W',' ',' ','W',' ',' ',' ','W',' ','W',' ',' ',' ','W',' ',' ',' ',' ','W',' ','W',' '],
  [' ','W',' ','W',' ','W',' ',' ',' ','W',' ',' ','W',' ','W',' ','W','W','W',' ',' ','W',' ','W',' ',' ',' '],
  [' ','W',' ',' ',' ',' ',' ','W','W','W',' ',' ','W',' ',' ',' ',' ',' ',' ',' ','W',' ',' ','W',' ','W','W'],
  [' ','W',' ','W','W',' ','W',' ',' ',' ',' ','W','W','W','W','W',' ','W','W','W','W',' ',' ',' ','W','W',' '],
  [' ','W',' ','W',' ',' ','W',' ',' ','W',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' '],
  [' ','W',' ','W',' ',' ','W','W','W',' ',' ','W',' ','W','W','W','W',' ','W','W',' ',' ','W','W','W',' ',' '],
  [' ',' ',' ','W',' ','W',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ',' ','W',' ',' ',' ',' ',' ','W'],
  [' ','W','W','W','W',' ',' ','W',' ',' ',' ','W','W','W','W',' ','W','W','W',' ',' ','W','W','W',' ','W',' '],
  [' ','W',' ',' ','W',' ',' ','W',' ',' ',' ','W',' ',' ',' ',' ',' ',' ',' ','W','W',' ',' ',' ','W',' ',' '],
  [' ','W',' ',' ','W',' ',' ','W',' ','W','W',' ',' ','W','W','W','W','W',' ',' ','W',' ','W',' ','W',' ',' '],
  [' ','W',' ','W','W',' ',' ','W',' ',' ',' ',' ',' ','W',' ',' ',' ',' ','W',' ',' ',' ','W',' ',' ','W',' '],
  [' ','W',' ','W',' ',' ',' ','W','W','W',' ',' ','W',' ',' ','W','W',' ',' ','W',' ',' ',' ','W',' ',' ',' '],
  [' ','W',' ',' ',' ','W','W',' ',' ',' ',' ','W',' ',' ','W','E',' ','W',' ',' ','W','W',' ',' ','W','W','W'],
  [' ','W',' ','W',' ',' ','W',' ','W','W',' ',' ','W',' ',' ','W',' ',' ',' ','W','W',' ','W',' ',' ',' ',' '],
  [' ','W',' ','W',' ',' ','W',' ','W',' ',' ',' ',' ','W',' ','W','W','W','W',' ',' ',' ',' ','W','W','W',' '],
  [' ','W',' ','W',' ',' ','W',' ','W',' ','W','W','W','W',' ',' ',' ',' ',' ',' ','W','W',' ','W',' ','W',' '],
  [' ',' ',' ','W',' ',' ',' ',' ','W',' ',' ',' ',' ',' ',' ','W',' ','W',' ','W',' ',' ',' ',' ',' ',' ',' '],
      ]
    case 'partitions':
      return [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 'W', 'W', 'W', 'W', 'W', 'W', 'W', 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 'W', 'W', 'W', 'W', 'W', 'W', 'W', 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 'W', 'W', 'W', 'W', 'W', 'W', 'W', 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 'W', 'W', 'W', 'W', 'W', 'W', 'W', 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ];
  }
}

export default chooseGrid;
