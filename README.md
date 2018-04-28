
# Revault: Yes, another state management library

## Table Of Contents
1. [Why Revault](#why-revault)
1. [Usage](#usage)
1. [Debugging](#debugging)
1. [Docs](#docs)

## Why Revault?
Don't get me wrong, I love [Redux](https://github.com/reactjs/redux) - it's made developing web apps extremely fun for the last two years and without doubt has pushed the web forward. Lately however, a few things have started to frustrate me:

1. Repetition. The boilerplate, just for the simplest task, has become wearisome.
1. Logic. Business logic is spread out. Some logic lives in the action, some logic lives in the reducer, some logic lives in the component.
1. Middleware. Gone are days of lost hours debugging misbehaving middlewares.

A few libaries have been released recently that have attempted to solve these issues. A few to note, and mainly where inspiration for Revault was drawn, are [Unstated](https://github.com/jamiebuilds/unstated) and [Statty](https://github.com/vesparny/statty). Both libraries use a basic component with [render props](https://reactjs.org/docs/render-props.html) to access global state ❤️ - but each had shortcomings. Unstated's concept of a `Store` is great for controlling central logic and is the core of Revault, but I didn't like the method of access via an array of subscriptions. I love Statty's access method, using a `select` prop to pluck only the pieces of state you want. But Statty was missing the central logic unit.

Thus, Revault was born. A hybrid child taking the best traits of both. Hope ya like it 👍

## Usage

### Begin by creating your first store, which extends from our base `Store`
```js
import { Store } from 'revault';

export default class TodoStore extends Store {
  state = {
    input: '',
    entries: [],
  };

  updateInput = input => {
    this.setState({ input });
  }

  addTodo = todo => {
    // setState has the same functionality as Component.setState,
    // except that it's synchronous
    this.setState({
      entries: [...this.state.entries, todo],
    });
  }
}
```

### Sweet. Now, we need to create the vault, passing in the store(s) you've created above.
```js
import { createVault } from 'revault';
import * as stores from './stores';

/*
  Stores may look something like:
  {
    todos: TodoStore,
    ...etc
  }
*/
const vault = createVault({ ...stores });

export default vault;
```

### We're really flying now. Next, wrap your application with the `Provider` and pass it the vault you just created:
```js
import { Provider as VaultProvider } from 'revault';
import vault from './vault';

const App = () => (
  <VaultProvider vault={vault}>
    <Entry />
  </VaultProvider>
)

render(<App />, document.getElementById("root"));
```


### And finally, drum roll please, import the `Connect` component to access our vault at render time.
```js
import { Connect } from 'revault';

export default (props) => (
  <Connect
    select={(stores) => ({
      todos: stores.todos.state.entries,
      input: stores.todos.state.input,
      updateInput: stores.todos.updateInput,
      addTodo: stores.todos.addTodo,
    })}
  >
    {({ todos, input, updateInput, addTodo }) => (
      <>
        <ul>
          {todo.map(todo => (
            <li>{todo}</li>
          ))}
        </ul>

        <form onSubmit={addTodo}>
          <input value={input} onChange={updateInput} />
          <button type="submit" >
            Submit
          </button>
        </form>
      <>
    )}
  </Connect>
)
```

There! You've done it. You have your first todo app in 4 simple steps. No more actions, dispatchers, middlewares. Just some stores and a render prop.

## Debugging
Inspired by [unstated-debug](https://github.com/sindresorhus/unstated-debug), Vault also comes fit with a debugging suite.

All you need to do is require the debug file, which will monkey patch both the Vault and Store classes, as well as add the vault instance to the window as `VAULT`:
```js
import 'revault/debug';
```
