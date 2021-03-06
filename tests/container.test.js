import React from 'react';
import { cleanup, render, fireEvent } from 'react-testing-library';
import { createHook } from '../src/container';

let useCounter;
let useCounter2;
let useCounter3;
let useCounter4;
let useCounter5;
let CounterCtx;
let CounterCtx2;
let CounterCtx3;
let CounterCtx4;
let Count;
let Count2;
let Count4;
let Counter;
let Counter2;
let Counter3;

const counter = (initial = 0) => {
  const [count, setCount] = React.useState(initial);
  const increment = (amount = 1) => setCount(s => s + amount);
  const decrement = (amount = 1) => setCount(s => s - amount);
  return [count, setCount, { increment, decrement }];
};

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return init(action.payload);
    default:
      throw new Error();
  }
}

const initialState = { count: 0 };

beforeEach(() => {
  useCounter = createHook(React.useState);
  useCounter2 = createHook(React.useState, 1);
  useCounter3 = createHook(counter);
  useCounter4 = createHook(({ reducer, initialState }) => React.useReducer(reducer, initialState));
  useCounter5 = createHook(React.useState, 1);

  CounterCtx = useCounter.Container;
  CounterCtx2 = useCounter2.Container;
  CounterCtx3 = useCounter3.Container;
  CounterCtx4 = useCounter4.Container;

  Count = () => <>Count: {useCounter()[0]}</>;
  Count2 = ({ id }) => <span data-testid={id}>Count2: {useCounter2()[0]}</span>;
  Count4 = ({ id }) => <span data-testid={id}>Count4: {useCounter4()[0].count}</span>;

  Counter = ({ id }) => {
    const [count, setCount, { increment, decrement }] = useCounter3();
    const updateState = () => setCount(100);
    return (
      // prettier-ignore
      <div>
        <span data-testid={`${id}-count`}>Count: {count}</span>
        <button data-testid={`${id}-dec`} onClick={() => decrement()}>-</button>
        <button data-testid={`${id}-inc`} onClick={() => increment()}>+</button>
        <button data-testid={`${id}-set`} onClick={updateState}>set</button>
      </div>
    );
  };

  Counter2 = ({ id }) => {
    const [count, setCount, { increment, decrement }] = useCounter3.get();
    const updateState = () => setCount(100);
    return (
      // prettier-ignore
      <div>
        <span data-testid={`${id}-count`}>Count: {count}</span>
        <button data-testid={`${id}-dec`} onClick={() => decrement()}>-</button>
        <button data-testid={`${id}-inc`} onClick={() => increment()}>+</button>
        <button data-testid={`${id}-set`} onClick={updateState}>set</button>
      </div>
    );
  };

  Counter3 = ({ id }) => {
    const [count] = useCounter5.get();
    return (
      // prettier-ignore
      <div>
        <span data-testid={`${id}-count`}>Count: {count}</span>
      </div>
    );
  };
});

afterEach(cleanup);

test('should return initial counter from Counter context', () => {
  const { getByText } = render(
    <CounterCtx initialArg={3}>
      <Count />
    </CounterCtx>
  );
  expect(getByText(/^Count:/).textContent).toBe('Count: 3');
});

test('should return initial counter from Counter context', () => {
  const { getByText } = render(
    <CounterCtx initialArg={3}>
      <Count />
    </CounterCtx>
  );
  expect(getByText(/^Count:/).textContent).toBe('Count: 3');
});

test('should return first value from initial array param from Counter context', () => {
  const { getByText } = render(
    <CounterCtx initialArg={[3]}>
      <Count />
    </CounterCtx>
  );
  expect(getByText(/^Count:/).textContent).toBe('Count: 3');
});

test('should return first value array from initial array param from Counter context', () => {
  const { getByText } = render(
    <CounterCtx initialArg={[[3, 5, 6], 4]}>
      <Count />
    </CounterCtx>
  );
  // JSX {[3,5,6]} output => 356
  expect(getByText(/^Count:/).textContent).toBe('Count: 356');
});

test('should pass context props like a initial object to hook', () => {
  const { getByText } = render(
    <CounterCtx4 reducer={reducer} initialState={initialState}>
      <Count4 />
    </CounterCtx4>
  );
  expect(getByText(/^Count4:/).textContent).toBe('Count4: 0');
});

test('should apply initial context params policy', () => {
  const utils = render(
    <CounterCtx2>
      <Count2 id="count1" />
    </CounterCtx2>
  );
  expect(utils.getByTestId('count1').textContent).toBe('Count2: 1');

  const utils2 = render(
    <CounterCtx2 initialArg={3}>
      <Count2 id="count2" />
    </CounterCtx2>
  );
  expect(utils.getByTestId('count2').textContent).toBe('Count2: 3');
});

test('should return initial counter from Counter and nested Counter2 context', () => {
  const { getByText } = render(
    <CounterCtx initialArg={3}>
      <span>
        <Count />
      </span>
      <CounterCtx2>
        <span>
          <Count2 />
        </span>
      </CounterCtx2>
    </CounterCtx>
  );
  expect(getByText(/^Count:/).textContent).toBe('Count: 3');
  expect(getByText(/^Count2:/).textContent).toBe('Count2: 1');
});

test('should incresase/decrease counter in a context', () => {
  const { getByText } = render(
    <CounterCtx3 initialArg={3}>
      <Counter />
    </CounterCtx3>
  );

  expect(getByText(/^Count:/).textContent).toBe('Count: 3');

  fireEvent.click(getByText('+'));
  fireEvent.click(getByText('+'));
  expect(getByText(/^Count:/).textContent).toBe('Count: 5');

  fireEvent.click(getByText('-'));
  expect(getByText(/^Count:/).textContent).toBe('Count: 4');

  fireEvent.click(getByText('set'));
  expect(getByText(/^Count:/).textContent).toBe('Count: 100');
});

test('should incresase/decrease counter in a nested context', () => {
  const { getByText, getByTestId } = render(
    <CounterCtx3 initialArg={4}>
      <Counter />
      <CounterCtx3 initialArg={1}>
        <Counter id="nested" />
      </CounterCtx3>
    </CounterCtx3>
  );

  expect(getByTestId('nested-count').textContent).toBe('Count: 1');

  fireEvent.click(getByTestId('nested-inc'));
  fireEvent.click(getByTestId('nested-inc'));
  expect(getByTestId('nested-count').textContent).toBe('Count: 3');

  fireEvent.click(getByTestId('nested-dec'));
  expect(getByTestId('nested-count').textContent).toBe('Count: 2');

  fireEvent.click(getByTestId('nested-set'));
  expect(getByTestId('nested-count').textContent).toBe('Count: 100');

  expect(getByText(/^Count:/).textContent).toBe('Count: 4');
});

test('should return initial counter from siblings Counter context', () => {
  const { getByTestId } = render(
    <>
      <CounterCtx3>
        <Counter id="counter1" />
      </CounterCtx3>
      <CounterCtx3 initialArg={2}>
        <Counter id="counter2" />
      </CounterCtx3>
      <CounterCtx3 initialArg={3}>
        <Counter id="counter3" />
      </CounterCtx3>
    </>
  );
  expect(getByTestId('counter1-count').textContent).toBe('Count: 0');
  expect(getByTestId('counter2-count').textContent).toBe('Count: 2');
  expect(getByTestId('counter3-count').textContent).toBe('Count: 3');
});

test('should incresase/decrease counter in a nested standalone context', () => {
  const { getByText, getByTestId } = render(
    <CounterCtx3 initialArg={4}>
      <Counter />
      <CounterCtx3 initialArg={1}>
        <Counter2 id="nested2" />
        <Counter id="nested" />
      </CounterCtx3>
    </CounterCtx3>
  );

  expect(getByTestId('nested2-count').textContent).toBe('Count: 1');

  fireEvent.click(getByTestId('nested2-inc'));
  fireEvent.click(getByTestId('nested2-inc'));
  expect(getByTestId('nested2-count').textContent).toBe('Count: 1');
  expect(getByTestId('nested-count').textContent).toBe('Count: 3');

  fireEvent.click(getByTestId('nested2-dec'));
  expect(getByTestId('nested-count').textContent).toBe('Count: 2');

  fireEvent.click(getByTestId('nested2-set'));
  expect(getByTestId('nested-count').textContent).toBe('Count: 100');

  expect(getByText(/^Count:/).textContent).toBe('Count: 4');
});

test('should return empty array on standalone without Container', () => {
  const { getByText, getByTestId } = render(<Counter3 id="standalone" />);
  expect(getByTestId('standalone-count').textContent).toBe('Count: ');
});

test('should console.error on render without container', () => {
  const spy = spyOn(console, 'error');
  render(<Count />);
  expect(spy).toHaveBeenCalled();
});
