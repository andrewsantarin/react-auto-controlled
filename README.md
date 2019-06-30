# react-auto-controlled
A collection of React component libraries (both class methods and Hooks) for self-governing state values.

- [Why?](#Why)
- [Installation](#Installation)
- [Usage](#Usage)
  - [Class State Manager](#Class-State-Manager)
  - [Function Hooks](#Function-Hooks)
- [Contribution](#Contribution)
- [License](#License)

## Why?
1. You need to write (most likely generic) components which have simple state controls to them, such as visibility toggles or simple number displays which should be controlled by the component without having to provide a controlled prop, but you don't want to write boilerplate code every time across multiple projects.
2. You found `<AutoControlledComponent>` class used by [`semantic-ui-react`](https://github.com/Semantic-Org/Semantic-UI-React/blob/master/src/lib/AutoControlledComponent.js) and [`@stardust-ui/react`](https://github.com/stardust-ui/react/blob/master/packages/react/src/lib/AutoControlledComponent.tsx) does roughly what you want, but it's either not exported (`semantic-ui-react`) or requires dependencies to other unnecessary modules (`@stardust-ui/react`).

Enter this library. Its component utilities behave roughly in the manner you'd expect if you were to use `<AutoControlledComponent>`, with some differences. Include support for a Hook-based counterpart and you get `react-auto-controlled`.

## Installation

**NPM**
```
npm install --save react-auto-controlled
```

**Yarn**
```
yarn add react-auto-controlled
```

This package contains definitions for [TypeScript](https://www.typescriptlang.org/).
You don't need to install a `@types/react-auto-controlled` module.
All examples are written in TypeScript. Pure JavaScript developers are encouraged to see the inner workings of the API.

## Usage

### Class State Manager
The Class State Manager offers a set of methods in order to autocontrol state. Unlike `<AutoControlledComponent>`,
it's not an extension of the React `Component` class. You'll need to declare your own class component separately.

This approach was taken in order to reduce `static` attribute pollution on the component class, which can also
be potentially overridden by an unattentive developer. The manager's methods are immutable.

```tsx
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

### Function Hooks
Unlike a Class State Manager, a Hook only manages **one** slice of the state, similar to the React `useState` hook.
By using Hooks, you gain more control over which state you'd prefer to update. However, in the spirit of `useState`,
you have to invoke the state modifer one by one if you want to update multiple states at once.

```tsx
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

## Contribution
This library is still very much a work in progress was hastily started so that it can be used immediately in bigger projects.

Ideas & support are more than welcome!

1. Fork the project.
2. Run the project in development mode: `yarn develop`.
3. Make changes to the code.
4. Add new tests.
5. Test the code: `yarn test`. If the tests fail, check the code again. Make sure the tests pass!
6. Lint the code: `yarn lint`. Clean up all linting errors.
7. Update this readme with regards to the new API changes.
8. Commit the code.
9. Create a pull request.

## License
MIT
