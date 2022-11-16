import React, { useState, useEffect } from 'react';

import '../styles/index.scss';

interface IcellProps {
  row: number;
  cell: number;
  value: any;
  meta: any;
  updateGrid: any;
}

const Cell = (props: IcellProps) => {
  let status = '';
  if (props.meta.current === `${props.row}.${props.cell}`) status += ' active';
  else if (props.meta.potential === `${props.row}.${props.cell}`)
    status += ' potential';

  if (props.value === 'W') status += ' wall';
  else if (props.meta.discovered.has(`${props.row}.${props.cell}`))
    status += ' discovered';
  else if (props.meta.visited.has(`${props.row}.${props.cell}`))
    status += ' visited';
  else '';

  return (
    <input
      type='text'
      className={`cell ${status}`}
      onChange={(e) => {
        props.updateGrid(e, props.row, props.cell);
      }}
      value={props.value}
    />
  );
};
export default Cell;
