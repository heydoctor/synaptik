import { Store } from '../../src';
import { Stores } from '../synaptik';

export default class TodoStore extends Store<TodoStore, Stores> {
  state: { todos: string[] } = {
    todos: [],
  };

  addTodo = (todo: string) => {
    this.setState({
      todos: [...this.state.todos, todo],
    });
  };

  deleteTodo = (index: number) => {
    this.setState({
      todos: this.state.todos.filter((_, i) => i !== index),
    });
  };
}
