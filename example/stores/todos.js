import { Store } from '../../src';

export default class TodoStore extends Store {
  static initialState = {
    todos: [],
  };

  addTodo = todo => {
    this.state.todos = [...this.state.todos, todo];
  };

  deleteTodo = index => {
    this.state.todos = this.state.todos.filter((e, i) => i !== index);
  };
}
