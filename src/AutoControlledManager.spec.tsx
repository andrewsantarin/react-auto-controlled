import React, { Component } from 'react';
import { cleanup, render, fireEvent } from '@testing-library/react';

import { emulateDom } from './setup';
import { AutoControlled } from './AutoControlled';
import { AutoControlledManager } from './AutoControlledManager';


// Simulate DOM.
emulateDom();

// Automatically unmount and cleanup DOM after the test is finished.
afterEach(cleanup);

type TestComponentProps = {
  name?: string;
  defaultValue?: number;
  description?: string;
  value?: number;
};
type TestComponentState = {
  value: number;
  description: string;
  active: boolean;
};

let idCounter = 1;
const testAutoControlledManager = new AutoControlledManager<TestComponentState, TestComponentProps>(
  [
    // Only `value` will be auto-controlled.
    'value',
  ],
  {
    // State initializer
    getInitialAutoControlledState() {
      return {
        value: 0,
        description: 'Test',
        active: false,
      };
    },
  }
);

class TestComponent extends Component<TestComponentProps, TestComponentState> implements AutoControlled<TestComponentState> {
  state = testAutoControlledManager.getInitialAutoControlledStateFromProps(this.props);

  // Apply the manager functions to the corresponding component methods.
  static getDerivedStateFromProps = testAutoControlledManager.getDerivedStateFromProps;

  public trySetState = testAutoControlledManager.trySetState;

  public id = idCounter++; // to ensure we don't remount a different instance

  private handleClick = () => {
    this.trySetState({
      value: this.state.value + 1,
      description: 'New test',
      active: !this.state.active,
    });
  }

  render() {
    const {
      value,
      description,
      active,
    } = this.state;

    return (
      <div>
        <span data-testid="description">
          {description}
        </span>
        <span data-testid="active">
          {active.toString()}
        </span>
        <span data-testid="value">
          {value}
        </span>
        <button data-testid="button" onClick={this.handleClick}>
          Click me!
        </button>
      </div>
    );
  }
}

describe('AutoControlledManager', () => {
  it('should be defined', () => {
    expect(AutoControlledManager).toBeDefined();
  });

  it('should not self-update state when a prop has been provided', () => {
    const utils = render(<TestComponent value={123} />);
    expect(utils.getByTestId('value').textContent).toBe('123');

    const button = utils.getByTestId('button');
    fireEvent.click(button);
    expect(utils.getByTestId('value').textContent).toBe('123');

    // re-render the same component with different props
    utils.rerender(<TestComponent value={456} />);
    expect(utils.getByTestId('value').textContent).toBe('456');
  });

  it('should self-update state when a prop has not been provided', () => {
    const utils = render(<TestComponent />);
    expect(utils.getByTestId('value').textContent).toBe('0');

    const button = utils.getByTestId('button');
    fireEvent.click(button);
    expect(utils.getByTestId('value').textContent).toBe('1');

    // re-render the same component with different props
    utils.rerender(<TestComponent />);
    fireEvent.click(button);
    expect(utils.getByTestId('value').textContent).toBe('2');
  });

  it('should control only the prop keys provided to it', () => {
    expect(testAutoControlledManager.autoControlledProps).toEqual([ 'value' ]);

    const utils = render(<TestComponent value={123} />);
    expect(utils.getByTestId('value').textContent).toBe('123');
    expect(utils.getByTestId('description').textContent).toBe('Test');
    expect(utils.getByTestId('active').textContent).toBe('false');

    const button = utils.getByTestId('button');
    fireEvent.click(button);
    expect(utils.getByTestId('value').textContent).toBe('123');
    expect(utils.getByTestId('description').textContent).toBe('New test');
    expect(utils.getByTestId('active').textContent).toBe('true');
  });

  it('should initialize state from default props', () => {
    const utils = render(<TestComponent defaultValue={1000} />);
    expect(utils.getByTestId('value').textContent).toBe('1000');

    const button = utils.getByTestId('button');
    fireEvent.click(button);
    expect(utils.getByTestId('value').textContent).toBe('1001');

    // re-render the same component with different props
    utils.rerender(<TestComponent />);
    fireEvent.click(button);
    expect(utils.getByTestId('value').textContent).toBe('1002');
  });
});
