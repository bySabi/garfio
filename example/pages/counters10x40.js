import { useState } from 'react';
import { createStore, useStore } from 'garfio/store';

const one = createStore(useState, 0);
const two = createStore(useState, 1);
const three = createStore(useState, 2);
const four = createStore(useState, 3);
const five = createStore(useState, 4);

const Counters = () => {
  // 'tup' is tuple [count, setCount]
  const tup1 = useStore(one);
  const tup2 = useStore(two);
  const tup3 = useStore(three);
  const tup4 = useStore(four);
  const tup5 = useStore(five);

  const increment = set => c => set(c => c + 1);
  const decrement = set => c => set(c => c - 1);
  const reset = () => (tup1[1](0), tup2[1](0), tup3[1](0), tup4[1](0), tup5[1](0));

  return (
    <ul style={{ listStyle: 'none', borderStyle: 'solid' }}>
      {[tup1, tup2, tup3, tup4, tup5].map((tup, idx) => (
        <li key={idx}>
          <span>{tup[0]}</span>
          <button onClick={decrement(tup[1])}>-</button>
          <button onClick={increment(tup[1])}>+</button>
          <br />
        </li>
      ))}
      <li>
        <button onClick={reset}>reset</button>
      </li>
    </ul>
  );
};

// put <Counters /> in a table of 1x10 cells
const TableCounters = () => (
  <table>
    <tbody>
      <tr>
        {Array.from({ length: 10 }).map((_, idx) => (
          <td key={idx}>
            <Counters />
          </td>
        ))}
      </tr>
    </tbody>
  </table>
);

// This component don't "use" the stores, will not rendered on changes,
// destructured standalone setters will rerender components that "use" the stores.
const SetDefaults = () => {
  const set = (store, value) => {
    const [, set] = store.get(store);
    set(value);
  };

  return (
    <button onClick={() => (set(one, 0), set(two, 1), set(three, 2), set(four, 3), set(five, 4))}>
      SET defaults
    </button>
  );
};

// Repeat `TableCounters` component 40 times
export default () => (
  <ul style={{ listStyle: 'none' }}>
    <li>
      <SetDefaults />
    </li>
    {Array.from({ length: 40 }).map((_, idx) => (
      <li key={idx}>
        <TableCounters />
      </li>
    ))}
  </ul>
);
