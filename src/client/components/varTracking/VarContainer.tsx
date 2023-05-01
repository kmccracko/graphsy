import React, { useState, useEffect } from 'react';
import VarCard from './VarCard';

interface Card {
  keyName: string;
  value: any;
  type: string;
}
interface IvarContainerProps {
  [keyName: string]: Card;
}

const VarContainer = ({ vars }: IvarContainerProps) => {
  // loop through vars, creating cards
  const varsArr = [];
  for (const keyName in vars) {
    const value = vars[keyName];
    varsArr.push(
      <VarCard key={keyName} keyName={keyName} value={value} type='' />
    );
  }

  // display cards in return

  return <div id='var-container'>{varsArr}</div>;
};
export default VarContainer;
