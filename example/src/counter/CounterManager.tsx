import React, { Component } from 'react';
import { AutoControlled, AutoControlledManager } from 'react-auto-controlled';

import { CounterProps, CounterState } from './counter.types';


const counterAutoControlledManager = new AutoControlledManager<CounterState, CounterProps>(
  [
    'value', // A list of class component props you want to auto-control
  ],
  {
    // State initializer
    getInitialAutoControlledState() {
      return {
        value: 0,
      };
    },
  }
);

export class CounterManager extends Component<CounterProps, CounterState> implements AutoControlled<CounterState> {
  state = counterAutoControlledManager.getInitialAutoControlledStateFromProps(this.props);

  // Apply the manager functions to the corresponding component methods.
  static getDerivedStateFromProps = counterAutoControlledManager.getDerivedStateFromProps;
  public trySetState = counterAutoControlledManager.trySetState;

  private handleClick = () => {
    this.trySetState({
      value: this.state.value + 1,
    });
  }

  render() {
    return (
      <div>
        <button onClick={this.handleClick}>
          Value: <strong>{this.state.value}</strong>
        </button>
      </div>
    );
  }
}
