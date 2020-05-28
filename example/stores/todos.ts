import { Store } from '../../src';
import { Stores } from '../synaptik';

interface TodoState {
  todos: string[];
}

export default class TodoStore extends Store<TodoState, Stores> {
  state: TodoState = {
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
