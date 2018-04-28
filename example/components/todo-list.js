import React from 'react';
import { Connect } from '../../src/revault';

export default () => (
  <Connect
    select={({ todos }) => ({
      todos: todos.state.entries,
      input: todos.state.input,
      updateInput: todos.updateInput,
      addTodo: todos.addTodo,
      deleteTodo: todos.deleteTodo,
    })}
  >
    {state => (
      <div>
        {console.log('Rendering ToDo List')}
        <h2>ToDo List</h2>

        <ul>
          {state.todos.map((entry, i) => (
            <li key={entry}>
              {entry}&nbsp;
              <span onClick={() => state.deleteTodo(i)}>x</span>
            </li>
          ))}
        </ul>

        <form onSubmit={state.addTodo}>
          <input value={state.input} onChange={state.updateInput} />
          <button type="submit">Submit</button>
        </form>
      </div>
    )}
  </Connect>
);
