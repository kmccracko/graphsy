import React, { useState, useEffect } from 'react';

interface iLogContainerProps {
  logs: [string, any][];
  [i: number]: number;
}

const LogContainer = ({ logs }: iLogContainerProps) => {
  // loop through logs, creating cards
  const logsArr = [];
  for (let i = logs.length - 1; i >= 0; i--) {
    const log = logs[i];
    logsArr.push(
      log.length > 1 ? (
        <div className='log-a'>
          <label>{log[0]}</label>
          <p>{JSON.stringify(log[1])}</p>
        </div>
      ) : (
        <div className='log-b'>
          <p>{log[0]}</p>
        </div>
      )
    );
  }

  // display cards in return

  return <div id='log-container'>{logsArr}</div>;
};
export default LogContainer;
