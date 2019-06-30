import { Component, GetDerivedStateFromProps } from 'react';

import isFunction from 'lodash/isFunction';
import isUndefined from 'lodash/isUndefined';

import { AnyObject } from './AnyObject';
import { AutoControlled } from './AutoControlled';


const getDefaultPropName = function getDefaultPropName(prop: string) {
  return `default${prop[0].toUpperCase() + prop.slice(1)}`;
};

const getAutoControlledStateValue = function getAutoControlledStateValue<
  Props extends any,
  State extends any = undefined
>(
  propName: string,
  props: Props,
  state: State,
  includeDefaults: boolean = false
) {
  // regular props
  const propValue = props[propName];
  if (!isUndefined(propValue)) return propValue;

  if (includeDefaults) {
    // defaultProps
    const defaultProp = props[getDefaultPropName(propName)];
    if (!isUndefined(defaultProp)) return defaultProp;

    // initial state - state may be null or undefined
    if (state) {
      const initialState = state[propName];
      if (!isUndefined(initialState)) return initialState;
    }
  }

  // React doesn't allow changing from uncontrolled to controlled components,
  // default checked/value if they were not present.
  if (propName === 'checked') return false;
  if (propName === 'value') return props.multiple ? [] : '';

  // otherwise, undefined
};

/**
 * A manager providing methods which can automatically update very
 * specific key-value pairs of a component's state object as provided.
 * 
 * Mimics `semantic-ui-react`/`@stardust-ui/react` in terms of behavior
 * although it is not inheritable.
 * 
 * **Example:**
  ```
  import React, { Component } from 'react';
  import { AutoControlledManager, AutoControlled } from 'react-auto-controlled';

  type CounterProps = {
    otherProp?: string;
    value?: number;
    defaultValue?: number;
    name?: string;
    defaultName?: string;
  };

  type CounterState = Required<
    Pick<CounterProps, 'value' | 'name'>
  >;

  const counterAutoControlledManager = new AutoControlledManager<AppState, AppProps>(
    [
      // A list of class component props you want to auto-control
      'value',
      'name',
    ],
    {
      // State initializer
      getInitialAutoControlledState() {
        return {
          active: false,
          name: 'Andrew',
          level: 0,
        };
      }
    }
  );

  export class Counter 
    extends Component<CounterProps, CounterState>
    implements AutoControlled<CounterState> // Enforce the `.trySetState(maybeState, callback?)` class method.
  {
    // Use `constructor` if you have custom logic in the state / attribute / method assignment.
    constructor(props: CounterProps) {
      super(props);

      this.state = counterAutoControlledManager.getInitialAutoControlledStateFromProps(props);
    }

    // Take this approach if you have zero custom logic. Just use `this.props`. Convenient!
    state = counterAutoControlledManager.getInitialAutoControlledStateFromProps(this.props);

    // Apply the manager functions to the corresponding component methods.
    static getDerivedStateFromProps = counterAutoControlledManager.getDerivedStateFromProps;
    public trySetState = counterAutoControlledManager.trySetState;

    private handleClick = () => {
      // Replace `this.setState()` with `this.trySetState()` to achieve auto-control.
      this.trySetState({
        value: this.state.value + 1,
        name: 'Bob',
      });
    }

    render() {
      const { value, name } = this.state;
      return (
        <div>
          <button onClick={this.handleClick}>
            Value: <strong>{value}</strong>
          </button>
          <div>
            Hello, {name}!
          </div>
        </div>
      );
    }
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
 * @class AutoControlledManager
 * @implements {AutoControlledManager<State, Props>}
 * @template State
 * @template Props
 */
export class AutoControlledManager<
  State extends AnyObject,
  Props extends Partial<State>
> implements AutoControlled<State> {
  /**
   * A list of props auto controlled by its manager's functions.
   *
   * @type {(keyof State)[]}
   */
  readonly autoControlledProps: (keyof State)[];
  /**
   * Builds state from new props & old state whenever the component updates,
   * including during the component's initial render itself.
   *
   * @param {object} nextProps New props.
   * @param {object} prevState Old state.
   * @returns {(object | null)} New state object if the state depends on props or
   * `null` if there is nothing for the state to derive from.
   */
  readonly getDerivedStateFromProps: GetDerivedStateFromProps<Props, State>;
  /**
   * Builds initial state from props that might be controlled by the user.
   *
   * @param {object} props Props possibly controlled by the user.
   * @returns {object} Full initial state of the component.
   */
  readonly getInitialAutoControlledStateFromProps: (props: Props) => State;

  /**
   * Creates an instance of `AutoControlledManager`.
   * @param {(keyof State)[]} autoControlledProps Keys to props which will be converted into the component's auto-controlled internal state.
   * @param {{
   *       getInitialAutoControlledState?: (props: Props) => State;
   *       getAutoControlledStateFromProps?: (
   *         props: Props,
   *         state: State
   *       ) => Partial<State>;
   *     }} [propsToStateDerivers={}] A set of methods which determine the component's initial state and the state after every rerender.
   * @memberof AutoControlledManager2
   */
  constructor(
    autoControlledProps: (keyof State)[],
    propsToStateDerivers: {
      getInitialAutoControlledState?: (props: Props) => State;
      getAutoControlledStateFromProps?: (
        props: Props,
        state: State
      ) => Partial<State>;
    } = {}
  ) {
    const {
      getInitialAutoControlledState,
      getAutoControlledStateFromProps,
    } = propsToStateDerivers;
    this.autoControlledProps = autoControlledProps;

    this.getDerivedStateFromProps = function getDerivedStateFromProps(nextProps, prevState) {
      // Solve the next state for autoControlledStateKeys
      const newStateFromProps = autoControlledProps.reduce<Partial<State>>(
        (acc, prop) => {
          // if next is defined then use its value
          if (!isUndefined(nextProps[prop])) {
            acc[prop] = nextProps[prop];
          }

          return acc;
        },
        {}
      );

      // Due to the inheritance of the AutoControlledComponent we should call its
      // getAutoControlledStateFromProps() and merge it with the existing state
      if (isFunction(getAutoControlledStateFromProps)) {
        const computedState = getAutoControlledStateFromProps(nextProps, {
          ...prevState,
          ...newStateFromProps,
        });

        // We should follow the idea of getDerivedStateFromProps() and return only modified state
        return {
          ...newStateFromProps,
          ...computedState,
        };
      }

      return newStateFromProps;
    };

    this.getInitialAutoControlledStateFromProps = function getInitialAutoControlledStateFromProps(props: Props) {
      const state = isFunction(getInitialAutoControlledState) ? getInitialAutoControlledState(props) : ({} as State);
      const initialAutoControlledState = autoControlledProps.reduce<Partial<State>>(
        (acc, prop) => {
          acc[prop] = getAutoControlledStateValue(prop as string, props, state, true);

          return acc;
        },
        {}
      );

      const initialState: State = {
        ...state,
        ...initialAutoControlledState,
      };

      return initialState;
    };

    // Lock the instance down.
    // https://www.everythingfrontend.com/posts/immutable-classes-in-javascript.html#usage-with-classes
    Object.freeze(this);
  }

  trySetState(maybeState: Partial<State>, callback?: () => void) {
    type ScopedComponent = Component<Props, State, any>;

    const newState = Object.keys(maybeState).reduce<typeof maybeState>(
      (acc, prop: keyof Partial<State>) => {
        // ignore props defined by the parent
        if (!isUndefined((this as any as ScopedComponent).props[prop])) {
          return acc;
        }

        acc[prop] = maybeState[prop];

        return acc;
      },
      {}
    );

    if (Object.keys(newState).length === 0) {
      return;
    }

    (this as any as ScopedComponent).setState(
      newState as Pick<State, keyof typeof newState>,
      callback
    );
  }
}
