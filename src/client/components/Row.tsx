import React, { useState, useEffect } from 'react';
import Cell from './Cell';

import '../styles/index.scss';

interface IrowProps {
  size: number;
  row: number;
  cells: any;
  meta: any;
  updateGrid: any;
}

const Row = (props: IrowProps) => {
  const cells = props.cells.map((cell: any, i: number) => {
    return (
      <Cell
        key={i}
        row={props.row}
        cell={i}
        value={cell}
        meta={props.meta}
        updateGrid={props.updateGrid}
      ></Cell>
    );
  });

  return (
    <div
      style={{ gridTemplateColumns: `repeat(${cells.length},${props.size}%)` }}
      className='row'
    >
      {cells}
    </div>
  );
};
export default Row;
