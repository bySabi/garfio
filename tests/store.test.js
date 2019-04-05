import React from 'react';
import { act, cleanup, renderHook } from 'react-hooks-testing-library';
import { createStore, useStore, getStore, removeStore } from '../src/store';

const store3 = Symbol();

createStore('1', React.useState, 0);
createStore('2', () => {
  const [s, set] = React.useState(1);
  return { count: s, setCount: set };
});
createStore(store3, React.useState, 2);
createStore('4', React.useState);

beforeEach(() => {});

afterEach(cleanup);

test('should return initial counter value', () => {
  let count;
  renderHook(() => ([count] = useStore('1')));
  expect(count).toBe(0);
});

test('should increase/decrease counter value', () => {
  let count, setCount;
  renderHook(() => ([count, setCount] = useStore('1')));
  expect(count).toBe(0);

  act(() => {
    setCount(1);
  });
  expect(count).toBe(1);
});

test('should increase/decrease counter value from standalone', () => {
  let count;
  renderHook(() => ([count] = useStore('1')));
  expect(count).toBe(0);

  const [, setCount] = getStore('1');
  act(() => {
    setCount(1);
  });
  expect(count).toBe(1);
});

test('should shared hook output', () => {
  let out1;
  renderHook(() => (out1 = useStore('1')));
  let out2;
  renderHook(() => (out2 = useStore('1')));
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
  renderHook(() => (out1 = useStore('2')));
  let out2;
  renderHook(() => (out2 = useStore('2')));
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
  renderHook(() => ([count1] = useStore('1', 4)));
  let count2;
  renderHook(() => ([count2] = useStore('1', 5)));
  expect(count1).toBe(0);
  expect(count1).toBe(count2);
});

test('should non-Host continue life after Host unmount', () => {
  const { unmount } = renderHook(() => useStore('1'));

  let count;
  renderHook(() => ([count] = useStore('1'))); // a non-Host
  expect(count).toBe(0);

  unmount(); // Host

  // 'non-Host' still have state but setCount cannot be called, a new Host is needed
  expect(count).toBe(0);
});

test('should return initial counter value with Symbol store name', () => {
  let count;
  renderHook(() => ([count] = useStore(store3)));
  expect(count).toBe(2);
});

test('should return true on store removed', () => {
  expect(removeStore('1')).toBe(true);
});

test('should console.error on already exist store', () => {
  const spy = spyOn(console, 'error');
  createStore('4', React.useState);
  expect(spy).toHaveBeenCalled();
});

test('should console.error on not found store #1', () => {
  const spy = spyOn(console, 'error');
  renderHook(() => useStore('5'));
  expect(spy).toHaveBeenCalled();
});

test('should console.error on not found store #2', () => {
  const spy = spyOn(console, 'error');
  getStore('5');
  expect(spy).toHaveBeenCalled();
});
