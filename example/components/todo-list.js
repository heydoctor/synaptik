import React, { useState } from 'react';
import { useSynaptik } from '../../src/synaptik';

export default () => {
  const [todoInput, setTodoInput] = useState('');
  const state = useSynaptik(({ todos }) => ({
    todos: todos.state.todos,
    addTodo: todos.addTodo,
    deleteTodo: todos.deleteTodo,
  }));

  const onSubmit = (e) => {
    e.preventDefault();
    state.addTodo(todoInput);
    setTodoInput('');
  }

  return (
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

      <form onSubmit={onSubmit}>
        <input value={todoInput} onChange={(e) => setTodoInput(e.target.value)} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
