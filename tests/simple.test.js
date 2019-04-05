import React from 'react';
import { act, cleanup, renderHook } from 'react-hooks-testing-library';
import { createHook } from '../src/simple';

let useCounter;
let useCounter2;

beforeEach(() => {
  useCounter = createHook(React.useState, 0);
  useCounter2 = createHook(() => {
    const [s, set] = React.useState(0);
    return { count: s, setCount: set };
  });
});

afterEach(cleanup);

test('should return initial counter value', () => {
  let count;
  renderHook(() => ([count] = useCounter()));
  expect(count).toBe(0);
});

test('should increase/decrease counter value', () => {
  let count, setCount;
  renderHook(() => ([count, setCount] = useCounter()));
  expect(count).toBe(0);

  act(() => {
    setCount(1);
  });
  expect(count).toBe(1);
});

test('should increase/decrease counter value from standalone', () => {
  let count;
  renderHook(() => ([count] = useCounter()));
  expect(count).toBe(0);

  const [, setCount] = useCounter.get();
  act(() => {
    setCount(1);
  });
  expect(count).toBe(1);
});

test('should shared hook output', () => {
  let out1;
  renderHook(() => (out1 = useCounter()));
  let out2;
  renderHook(() => (out2 = useCounter()));
  expect(out1).toBe(out2);

  let [count] = out2;
  expect(count).toBe(0);

  const [, setCount] = out1;
  act(() => {
    setCount(2);
  });
  [count] = out2;
  expect(count).toBe(2);
  expect(out1).toBe(out2);
});

test('should shared hook output#2', () => {
  let out1;
  renderHook(() => (out1 = useCounter2()));
  let out2;
  renderHook(() => (out2 = useCounter2()));
  expect(out1).toBe(out2);

  let { count } = out2;
  expect(count).toBe(0);

  const { setCount } = out1;
  act(() => {
    setCount(2);
  });

  count = out2.count;
  expect(count).toBe(2);

  expect(out1).toBe(out2);
});

test('should ignore initial param from hook call', () => {
  let count1;
  renderHook(() => ([count1] = useCounter(1)));
  let count2;
  renderHook(() => ([count2] = useCounter(2))); // ignore non-host initial
  expect(count1).toBe(0);
  expect(count1).toBe(count2);
});

test('should non-Host continue life after Host unmount', () => {
  const { unmount } = renderHook(() => useCounter()); // render Hookleton Host

  let count;
  renderHook(() => ([count] = useCounter())); // a non-Host
  expect(count).toBe(0);

  unmount(); // Host

  // 'non-Host' still have state but setCount cannot be called, a new Host is needed
  expect(count).toBe(0);
});
