import React from 'react';
import { act, cleanup, renderHook } from 'react-hooks-testing-library';
import { createStore, useStore } from '../src/store';

const one = createStore(React.useState, 0);
const two = createStore(() => {
  const [s, set] = React.useState(1);
  return { count: s, setCount: set };
});
const nonStore = {};

beforeEach(() => {});
afterEach(cleanup);

test('should return initial counter value', () => {
  let count;
  renderHook(() => ([count] = useStore(one)));
  expect(count).toBe(0);
});

test('should increase/decrease counter value', () => {
  let count, setCount;
  renderHook(() => ([count, setCount] = useStore(one)));
  expect(count).toBe(0);

  act(() => {
    setCount(1);
  });
  expect(count).toBe(1);
});

test('should increase/decrease counter value from standalone', () => {
  let count;
  renderHook(() => ([count] = useStore(one)));
  expect(count).toBe(0);

  const [, setCount] = one.get();
  act(() => {
    setCount(1);
  });
  expect(count).toBe(1);
});

test('should shared hook output', () => {
  let out1;
  renderHook(() => (out1 = useStore(one)));
  let out2;
  renderHook(() => (out2 = useStore(one)));
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
  renderHook(() => (out1 = useStore(two)));
  let out2;
  renderHook(() => (out2 = useStore(two)));
  expect(out1).toBe(out2);

  let { count } = out2;
  expect(count).toBe(1);

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
  renderHook(() => ([count1] = useStore(one, 4)));
  let count2;
  renderHook(() => ([count2] = useStore(one, 5)));
  expect(count1).toBe(0);
  expect(count1).toBe(count2);
});

test('should non-Host continue life after Host unmount', () => {
  const { unmount } = renderHook(() => useStore(one));

  let count;
  renderHook(() => ([count] = useStore(one))); // a non-Host
  expect(count).toBe(0);

  unmount(); // Host

  // 'non-Host' still have state but setCount cannot be called, a new Host is needed
  expect(count).toBe(0);
});

test('should return true on store removed', () => {
  expect(one.delete(one)).toBe(true);
});

test('should console.error on not found store #1', () => {
  const spy = spyOn(console, 'error');
  renderHook(() => useStore(nonStore));
  expect(spy).toHaveBeenCalled();
});
