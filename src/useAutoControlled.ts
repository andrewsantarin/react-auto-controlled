import { useState } from 'react';
import isUndefined from 'lodash/isUndefined';
import isEqual from 'lodash/isEqual';


/**
 * Returns a stateful value, and a function to update it, but only if no prop has been provided.
 * 
 * Mimics the `useState()` React Hook signature, but returns an additional method for
 * automatically deriving state from prop.
 * 
 * **Example:**
  ```
  import React, { useCallback } from 'react';
  import { useAutoControlled } from 'react-auto-controlled';

  interface CounterProps {
    otherProp?: string;
    value?: number;
    defaultValue?: number;
    name?: string;
    defaultName?: string;
  }

  export function Counter(props) {
    const [ value, trySetValue, getDerivedValueFromProp ] = useAutoControlled(0, props.value, props.defaultValue);
    const [ name, trySetName, getDerivedNameFromProp ] = useAutoControlled('Andrew', props.name, props.defaultName);

    getDerivedValueFromProp();
    getDerivedNameFromProp();

    const handleClick = useCallback(() => {
      trySetValue(value + 1);
      trySetName('Bob');
    }, [ trySetValue, value ]);

    return (
      <div>
        <button onClick={handleClick}>
          Value: <strong>{value}</strong>
        </button>
        <div>
          Hello, {name}!
        </div>
      </div>
    );
  }

  export function App() {
    // Details:
    // 1. Without a `prop`, the counter component starts at `0`, incrementing itself when its button is clicked.
    // 2. With a `defaultProp`, the counter component starts at `20`, incrementing itself when its button is clicked.
    // 3. With a `value`, the counter component will not update its value unless the user provides a `value` prop.
    return (
      <div>
        <Counter />
        <Counter defaultValue={20} defaultName="Cody" />
        <Counter value={10} name="Charlie" />
      </div>
    );
  }
  ```
 *
 * @export
 * @template State :: The state type, which can be anything.
 * @param {State} initialState The initial state of the state modifier hook, internal to the component.
 * @param {State} [prop] _(optional)_ A prop value to take complete control of the state, if provided.
 * @param {State} [defaultProp] _(optional)_ A prop value to take control of the initial state only, if provided.
 */
export const useAutoControlled = function useAutoControlled<State>(
  initialState: State,
  prop?: State,
  defaultProp?: State
): [
  State,
  React.Dispatch<React.SetStateAction<State>>,
  () => void
] {
  const [ state, setState ] = useState(!isUndefined(defaultProp) ? defaultProp : initialState);

  // Counterpart to the `static getDerivedStateFromProps` method, but for one key only.
  // When `prop` has changed since last render, update `state` with the `prop`'s value.
  // https://reactjs.org/docs/hooks-faq.html#how-do-i-implement-getderivedstatefromprops
  const getDerivedStateFromProp = function getDerivedStateFromProp() {
    if (isUndefined(prop) || isEqual(prop, state)) {
      return;
    }

    setState(prop);
  };

  // Attempt to modify the `state` value internally.
  // When `prop` has already been provided, defer to it and don't update `state`.
  const trySetState: React.Dispatch<React.SetStateAction<State>> = function trySetState(state) {
    if (!isUndefined(prop)) {
      return;
    }

    setState(state);
  };

  return [
    state,
    trySetState,
    getDerivedStateFromProp,
  ];
};
