import { useState } from 'react';
import { createHook } from 'garfio/container';

function counter(initial = 0) {
  const [count, setCount] = useState(initial);
  const increment = () => setCount(count + 1);
  return [count, increment];
}

const useCounter = createHook(counter);
const CounterContainer = useCounter.Container;

function Button() {
  const [, increment] = useCounter();
  return <button onClick={increment}>+</button>;
}

function Count() {
  const [count] = useCounter();
  return <p>{count}</p>;
}

export default () => (
  <>
    <CounterContainer initialArg={3}>
      <Count />
      <Button />
    </CounterContainer>
    <CounterContainer>
      <Count />
      <Button />
      <CounterContainer>
        <Count />
        <Button />
        <CounterContainer initialArg={4}>
          <Count />
          <Button />
          <CounterContainer initialArg={4}>
            <Count />
            <Button />
            <CounterContainer initialArg={4}>
              <Count />
              <Button />
              <CounterContainer initialArg={4}>
                <Count />
                <Button />
              </CounterContainer>
            </CounterContainer>
          </CounterContainer>
        </CounterContainer>
      </CounterContainer>
    </CounterContainer>
    <CounterContainer>
      <Count />
      <Button />
      <CounterContainer initialArg={3}>
        <Count />
        <Button />
      </CounterContainer>
    </CounterContainer>
  </>
);
