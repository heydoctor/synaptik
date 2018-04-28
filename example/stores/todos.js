import { Store } from '../../src/revault';

export default class TodoStore extends Store {
  state = {
    input: '',
    entries: [],
  };

  updateInput = event => {
    this.setState({
      input: event.target.value,
    });
  };

  addTodo = event => {
    event.preventDefault();

    if (!this.state.input) {
      return;
    }

    this.setState({
      input: '',
      entries: [...this.state.entries, this.state.input],
    });
  };

  deleteTodo = index => {
    this.setState({
      entries: this.state.entries.filter((e, i) => {
        return i !== index;
      }),
    });
  };

  getSortedTodos() {}
}
