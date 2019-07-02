import { useState } from 'react';
import isUndefined from 'lodash/isUndefined';
import isEqual from 'lodash/isEqual';


/**
 * Returns a stateful value, and a function to update it, but only if no prop has been provided.
 * 
 * Mimics the `useState()` React Hook signature, but returns an additional method for
 * automatically deriving state from prop.
 * 
 * @export
 * @template State :: The state type, which can be anything.
 * @param {State} initialState The initial state of the state modifier hook, internal to the component.
 * @param {Props} [props={}] (optional) Prop values to take control of the state and initial state, if provided.
 * @param {{ prop?: State; defaultProp?: State; }} [props={}]
 * @returns {[
 *   State,
 *   React.Dispatch<React.SetStateAction<State>>,
 *   () => void
 * ]}
 */
export const useAutoControlled = function useAutoControlled<State>(
  initialState: State,
  props: {
    /**
     * Controls the state on every render, including the initial state. Use this if you need external control.
     *
     * @type {State}
     */
    prop?: NonNullable<State>;
    /**
     * Controls the initial state. Use this if your uncontrolled component accepts a custom starting value.
     *
     * @type {State}
     */
    defaultProp?: NonNullable<State>;
  } = {}
): [
  State,
  React.Dispatch<React.SetStateAction<State>>,
  () => void
] {
  const { prop, defaultProp } = props;
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
