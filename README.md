# Revault
_The state management library you've been waiting for_

[![npm](https://img.shields.io/npm/v/revault.svg)](https://www.npmjs.com/package/revault)
[![npm](https://img.shields.io/npm/dm/revault.svg)](https://npm-stat.com/charts.html?package=revault&from=2017-05-19)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-prettier-brightgreen.svg)](http://standardjs.com/)
[![MIT License](https://img.shields.io/npm/l/revault.svg?style=flat-square)](https://github.com/kylealwyn/revault/blob/master/LICENSE)

## Table Of Contents
1. [Why Revault?](#why-revault)
1. [Usage](#usage)
1. [Debugging](#debugging)
1. [Docs](#docs)

## Why Revault?
[Redux](https://github.com/reactjs/redux) is great and without doubt has helped push the web forward by providing a strong mental model around global state. Lately however, a few things have started to frustrate me when using Redux:

1. Repetition. The boilerplate, just for the most simple task, has become wearisome.
1. Logic. Business logic is spread out. Some logic lives in the action, some lives in the reducer, and yet some more lives in the component.
1. Middleware. Apart from logging and handling promises, middleware is more of a hassle than a help.

A few libaries have been released recently that have attempted to solve these issues. Two to note, and mainly where inspiration for Revault was drawn, are [Unstated](https://github.com/jamiebuilds/unstated) and [Statty](https://github.com/vesparny/statty). Both libraries use a basic component with [render props](https://reactjs.org/docs/render-props.html) to access global state ❤️ - but each had shortcomings.

Unstated's `Container` works well to control business logic and encapsulate several pieces of state, all while feeling very familiar to Component local state. Containers, otherwise known as Stores in Revault, live on, only accessed differently on render.

Statty's approach to access is great - by using a `select` prop to pluck only the pieces of state you want, it's easy to inject derived state as a render prop, while also making it easy to check for referential equality to prevent unecessary renders. Statty was only missing a dedicated logic unit.

Thus, Revault was born - marrying the concepts of Unstated and Statty in what looks to be a happy union. Hope y'all like it! 😎

## Usage

Begin by creating your first store, which extends from `Store`
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
    // setState has the same functionality as Component.setState
    // meaning that it runs async and can also take a function.
    this.setState({
      entries: [...this.state.entries, todo],
    });
  }
}
```


Sweet. Next, wrap your application with the `Provider` and pass in your stores.
```jsx
import { render } from 'react-dom';
import { Provider as VaultProvider } from 'revault';
import * as stores from './stores';

/*
  `stores` may look something like the following. The key's will be as
  identifier's when accessing the store during render.
  {
    todos: TodoStore,
    ...etc
  }
*/

const App = () => (
  <VaultProvider stores={stores}>
    <Entry />
  </VaultProvider>
);

render(<App />, window.root);
```


And finally, drum roll please 🥁, import the `Connect` component to access our vault on render:
```jsx
import { Connect } from 'revault';

export default () => (
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
          {todos.map(todo => (
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

You've done it! You have your first todo app up and running 3 simple steps.


## Debugging
Inspired by [unstated-debug](https://github.com/sindresorhus/unstated-debug), Vault also comes with a debugging module.

All you need to do is import the debug file, which will monkey patch both the Vault and Store classes, as well as add the vault instance to the window as `window.VAULT`:
```js
import 'revault/debug';
```

## Docs

### `<Provider>`

Make the vault available to `<Connect>` via context

#### props

##### `stores`

> `object` | required

A hash of stores. The key will be used as the accessor name when selecting state. The value is your Store constructor.

##### `vault`

> `object`

Alternatively, you can pass in a preinstantiated vault. This is helpful during testing.

##### `logger`

> `function(oldState: object, newState: object)`

Use the inspector prop during development to log state changes.

`revault` comes with a default logger inspired by [unstated-debug](https://github.com/sindresorhus/unstated-debug).

```jsx
import logger from 'revault/logger';

<Provider
  stores={{
    todos: TodoStore
  }}
  logger={logger}
/>
```

### `<Connect>`

Connect is a PureComponent that observes pieces of state and re-renders only when those pieces of state update.

#### props

##### `select`

> `function(stores: object, state: object) | defaults to s => s | returns object`

Selects the slice of the state needed by the children components.

##### `render`

> `function(state: object)` | required

A render prop that is passed the object returned by `select`. You can pass the render function as a child of `<Connect>`.
