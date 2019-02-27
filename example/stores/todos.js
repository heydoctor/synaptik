import { Store } from '../../src';

export default class TodoStore extends Store {
  state = {
    todos: [],
  };

  addTodo = todo => {
    this.setState({
      todos: [...this.state.todos, todo],
    });
  };

  deleteTodo = index => {
    this.setState({
      todos: this.state.todos.filter((e, i) => {
        return i !== index;
      }),
    });
  };
}
