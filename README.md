# synaptik
_The state management library you've been waiting for_

[![Build Status](https://travis-ci.org/sappira-inc/synaptik.svg?branch=master)](https://travis-ci.org/sappira-inc/synaptik) [![codecov](https://codecov.io/gh/sappira-inc/synaptik/branch/master/graph/badge.svg)](https://codecov.io/gh/sappira-inc/synaptik)
[![npm](https://img.shields.io/npm/v/synaptik.svg)](https://www.npmjs.com/package/synaptik)
[![npm](https://img.shields.io/npm/dm/synaptik.svg)](https://npm-stat.com/charts.html?package=synaptik&from=2017-05-19)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-prettier-brightgreen.svg)](http://standardjs.com/)
[![MIT License](https://img.shields.io/npm/l/synaptik.svg?style=flat-square)](https://github.com/kylealwyn/synaptik/blob/master/LICENSE)

## Table Of Contents
1. [Why synaptik?](#why-synaptik)
2. [Usage](#usage)
3. [Docs](#docs)

## Why synaptik?
[Redux](https://github.com/reactjs/redux) is great and without doubt has helped push the web forward by providing a strong mental model around global state. Lately however, a few things have started to frustrate me when using Redux:

1. Repetition. The boilerplate, just for the most simple task, has become wearisome.
1. Logic. Business logic is spread out. Some logic lives in the action, some lives in the reducer, and yet some more lives in the component.
1. Middleware. Apart from logging and handling promises, middleware is more of a hassle than a help.

A few libaries have been released recently that have attempted to solve these issues. Two to note, and mainly where inspiration for synaptik was drawn, are [Unstated](https://github.com/jamiebuilds/unstated) and [Statty](https://github.com/vesparny/statty). Both libraries use a basic component with [render props](https://reactjs.org/docs/render-props.html) to access global state ❤️ - but each had shortcomings.

Unstated's `Container` works well to control business logic and encapsulate several pieces of state, all while feeling very familiar to Component local state. Containers, otherwise known as Stores in synaptik, live on, only accessed differently on render.

Statty's approach to access is great - by using a `select` prop to pluck only the pieces of state you want, it's easy to inject derived state as a render prop, while also making it easy to check for referential equality to prevent unecessary renders. Statty was only missing a dedicated logic unit.

Thus, synaptik was born - marrying the concepts of Unstated and Statty in what looks to be a happy union. Hope y'all like it! 😎

## Usage

Begin by creating your first store, which extends from `Store`:

```js
import { Store } from 'synaptik';

export default class TodoStore extends Store {
  state = {
    input: '',
    entries: [],
  };

  updateInput = input => {
    this.setState({ input });
  }

  addTodo = todo => {
    // setState acts like React component's setState,
    // meaning that it runs asynchronously and can also be passed an updater function.
    this.setState({
      entries: [...this.state.entries, todo],
    });
  }
}
```

Next, wrap your application with the `Provider` and pass in your stores.

```jsx
import { render } from 'react-dom';
import { Provider as VaultProvider } from 'synaptik';
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

Finally, drum roll please 🥁, use the `Connect` component to access our vault on render:

```jsx
import { Connect } from 'synaptik';

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
      </>
    )}
  </Connect>
)
```

You can also use the `connect` [HOC](https://reactjs.org/docs/higher-order-components.html) if you need to perform more complex logic in component methods:

```jsx
import React, { Component } from 'react';
import { connect } from 'synaptik';

@connect((stores) => ({
  todos: stores.todos.state.entries,
  input: stores.todos.state.input,
  updateInput: stores.todos.updateInput,
  addTodo: stores.todos.addTodo,
}))
export default class TodoList extends Component {
  render() {
    const { todos, input, updateInput, addTodo } = this.props;

    return (
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
      </>
    )
  }
}
```

You've done it! You have your first todo app up and running 3 simple steps.

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

`synaptik` comes with a default logger inspired by [unstated-debug](https://github.com/sindresorhus/unstated-debug).

```jsx
import logger from 'synaptik/logger';

<Provider
  stores={{
    todos: TodoStore,
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

##### `lifecycle`

> `object`

Access lifecycle methods of `<Connect>`. Each method has the same signature as `select` - so they will be passed `stores` and `state`. Comes with support for:
- `didMount`
- `didUpdate`
- `willUnmount`

Often, we need to do work in the lifecycle methods but that can be difficult when using functional components. `lifecycle` makes it easy to kick off async work when mounting or performing cleanup when unmounting.

```jsx
<Connect
  select={() => ({})}
  lifecycle={{
    didMount(stores) {
      stores.users.fetch(id);
    },
    willUnmount(stores) {
      stores.users.cleanup();
    }
  }}
/>
```

##### `render`

> `function(state: object)` | required

The render fn is passed the observed state returned by `select`. You can also use a child function.

## LICENSE
[MIT License](LICENSE) © [Kyle Alwyn](kylealwyn.com)
