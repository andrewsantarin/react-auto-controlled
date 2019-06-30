export type CounterProps = {
  name?: string;
  defaultValue?: number;
  value?: number;
};

export type CounterState = Required<Pick<CounterProps, 'value'>>;
