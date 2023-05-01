import React, { useState, useEffect } from 'react';

interface IvarCardProps {
  keyName: string;
  value: any;
  type?: string;
}

const VarCard = ({ keyName, value, type }: IvarCardProps) => {
  // Represent the data
  let valueRepresentation: any = 'NO MATCH';
  // Number
  if (typeof value === 'number') {
    valueRepresentation = <span className='var-number'>{value}</span>;
  }
  // String
  else if (typeof value === 'string') {
    valueRepresentation = `${'"' + value + '"'}`;
  }
  // Boolean
  else if (typeof value == 'boolean') {
    valueRepresentation = value;
  }
  // Array
  else if (Array.isArray(value) || value.has) {
    const elArr = [];
    let first = true;
    elArr.push(<span key={keyName + '1'.toString()}>{'['}</span>);
    for (const el of value) {
      let content;
      if (!first) {
        content = `, ${JSON.stringify(el)}`;
      } else {
        content = `${JSON.stringify(el)}`;
        first = false;
      }
      elArr.push(
        <span key={keyName + el.toString()} className='array-card-element'>
          {content}
        </span>
      );
    }
    elArr.push(<span key={keyName + '2'.toString()}>{']'}</span>);
    valueRepresentation = elArr;
  }
  // Object
  else {
    const elArr = [];
    let first = true;
    elArr.push(<span key={keyName + '1'.toString()}>{'{'}</span>);
    elArr.push(<div></div>);
    for (const el in value) {
      if (!first) {
        elArr.push(<span>{`, `}</span>);
        elArr.push(<div></div>);
      } else {
        first = false;
      }
      elArr.push(
        <span key={keyName + el.toString()} className='array-card-element'>
          {`${JSON.stringify(el)} : ${JSON.stringify(value[el])}`}
        </span>
      );
    }
    elArr.push(<div></div>);
    elArr.push(<span key={keyName + '2'.toString()}>{'}'}</span>);
    valueRepresentation = elArr;
  }

  return (
    <div className='var-card'>
      <div className='var-card-title'>{keyName}</div>
      <div className='var-card-value'>{valueRepresentation}</div>
    </div>
  );
};
export default VarCard;
