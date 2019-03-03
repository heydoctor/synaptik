import React from 'react';
import { useSynapse } from '../../src';

export default function Counter() {
  const state = useSynapse(({ counter }) => ({
    count: counter.state.count,
    increment: counter.increment,
    decrement: counter.decrement,
  }));

  return (
    <div>
      <h2>Counter</h2>
      {console.info('Rendering Counter')}
      <button onClick={state.decrement}>-</button>
      {state.count}
      <button onClick={state.increment}>+</button>
    </div>
  )
}
