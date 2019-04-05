import { createHook } from 'garfio/simple';

// useCounter is a useState but global
const useCounter = createHook(useState, 0);

const Increment = () => {
  const [, update] = useCounter();
  const increment = () => update(s => s + 1);
  return <button onClick={increment}>+</button>;
};

const Decrement = () => {
  const [, update] = useCounter();
  const decrement = () => update(s => s - 1);
  return <button onClick={decrement}>-</button>;
};

const Value = () => {
  const [count] = useCounter();
  return <span>{count}</span>;
};

export default () => (
  <div>
    <Value />
    <Increment />
    <Decrement />
  </div>
);
