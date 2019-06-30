import React from 'react';

import { CounterHook } from 'counter/CounterHook';
import { CounterManager } from 'counter/CounterManager';


interface ExampleProps {
  defaultValue?: number;
}

export const Example = function Example(props: ExampleProps) {
  return (
    <div className="App">
      <h1>Hooks</h1>
      <div>
        <div>
          Uncontrolled.
        </div>
        <CounterHook />
      </div>
      <div>
        <div>
          Uncontrolled with default.
        </div>
        <CounterHook defaultValue={props.defaultValue} />
      </div>
      <div>
        <div>
          Controlled.
        </div>
        <CounterHook value={props.defaultValue} />
      </div>
      <h2>vs.</h2>
      <h1>Class with Manager</h1>
      <div>
        <div>
          Uncontrolled.
        </div>
        <CounterManager />
      </div>
      <div>
        <div>
          Uncontrolled with default.
        </div>
        <CounterManager defaultValue={props.defaultValue} />
      </div>
      <div>
        <div>
          Controlled.
        </div>
        <CounterManager value={props.defaultValue} />
      </div>
    </div>
  );
};
