import React, { useState, useCallback } from 'react';

import { Example } from './Example';

export const App = function App() {
  const [ defaultValue, setDefaultValue ] = useState(10);

  const handleClick = useCallback(() => {
    setDefaultValue(value => value + 1);
  }, [ setDefaultValue ]);

  return (
    <div>
      <h1>
        <span>{defaultValue}</span>
        <button onClick={handleClick}>Increment default value</button>
      </h1>
      <Example defaultValue={defaultValue} />
    </div>
  );
};
