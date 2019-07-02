import React, { useCallback } from 'react';
import { useAutoControlled } from 'react-auto-controlled';

import { CounterProps } from './counter.types';


export const CounterHook = function CounterHook(props: CounterProps) {
  const [ value, trySetValue, getDerivedValueFromProp ] = useAutoControlled(0, {
    prop: props.value,
    defaultProp: props.defaultValue,
  });

  getDerivedValueFromProp();

  const handleClick = useCallback(() => {
    trySetValue(value + 1);
  }, [ trySetValue, value ]);

  return (
    <div>
      <button onClick={handleClick}>
        Value: <strong>{value}</strong>
      </button>
    </div>
  );
};
