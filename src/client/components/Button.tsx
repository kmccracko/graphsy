import React, { useState, useEffect } from 'react';

import '../styles/index.scss';

interface IbuttonProps {
  fullGrid: any;
  runAlgo: any;
}

const Button = (props: IbuttonProps) => {
  return (
    <button id='algobutton' onClick={() => props.runAlgo(true)}>
      CLICK MEEE
    </button>
  );
};
export default Button;
