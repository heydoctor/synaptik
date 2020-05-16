import React from 'react';
import { useSynapse } from '../synaptik';

export default function Counter() {
  const [count, increment, decrement] = useSynapse(
    ({ counter }) => [counter.state.count, counter.increment, counter.decrement] as const
  );

  return (
    <div>
      <h2>Counter</h2>
      {console.info('Rendering Counter')}
      <button onClick={decrement}>-</button>
      {count}
      <button onClick={increment}>+</button>
    </div>
  );
}
