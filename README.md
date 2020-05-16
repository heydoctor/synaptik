# ⚡️ Synaptik

_The state management library you've been waiting for_

[![Build Status](https://travis-ci.org/heydoctor/synaptik.svg?branch=master)](https://travis-ci.org/heydoctor/synaptik) [![codecov](https://codecov.io/gh/heydoctor/synaptik/branch/master/graph/badge.svg)](https://codecov.io/gh/heydoctor/synaptik)
[![npm](https://img.shields.io/npm/v/synaptik.svg)](https://www.npmjs.com/package/synaptik)
[![npm](https://img.shields.io/npm/dm/synaptik.svg)](https://npm-stat.com/charts.html?package=synaptik&from=2017-05-19)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-prettier-brightgreen.svg)](http://standardjs.com/)
[![MIT License](https://img.shields.io/npm/l/synaptik.svg?style=flat-square)](https://github.com/heydoctor/synaptik/blob/master/LICENSE)

## Table of Contents

1. [Why synaptik?](#why-synaptik)
2. [Usage](#usage)
3. [Docs](#docs)

## Why Synaptik?

[Redux](https://github.com/reactjs/redux) is a great tool and undoubtedly helped push the web forward by providing a strong mental model around global state. Redux, however, does come with its flaws:

1. Repetition. The boilerplate, just for the most simple task, has become wearisome.
2. Distributed logic. Business logic is spread out. Some logic lives in the action, some in the reducer, and some in the component.
3. Middleware. Apart from logging and handling promises, middleware ends up being a hassle and makes debugging terribly difficult.

Some other state management solutions in the wild have attempted to solve these issues. Two to note, and mainly where inspiration for Synaptik was drawn, are [Unstated](https://github.com/jamiebuilds/unstated) and [Statty](https://github.com/vesparny/statty). Both use a basic component with [render props](https://reactjs.org/docs/render-props.html) to access global state ❤️ - but each had shortcomings.

Unstated's `Container` works well to control business logic and encapsulate several pieces of state, all while feeling very familiar to Component local state. Containers, otherwise known as Stores in synaptik, live on, only accessed differently on render.

Statty's approach is great - by using a `select` prop to pluck only the pieces of state you want, it's easy to inject derived state as a render prop, while also making it easy to check for referential equality to prevent unecessary renders. Statty was only missing a dedicated logic unit.

Thus, Synaptik was born - marrying the concepts of Unstated and Statty in what looks to be a happy union. Hope y'all like it! 😎

## Usage

Begin by creating your first store, which extends from `Store`.

```ts
import { Store } from 'synaptik';
import { Stores } from 'app/lib/synaptik';

export default class TodoStore extends Store<TodoStore, Stores> {
  state: {
    input: string;
    entries: string[];
  } = {
    input: '',
    entries: [],
  };

  updateInput = (input: string) => {
    this.setState({ input });
  };

  addTodo = (todo: string) => {
    // setState acts like React component's setState,
    // meaning that it runs asynchronously and can also be passed an updater function.
    this.setState({
      entries: [...this.state.entries, todo],
    });
  };
}
```

Next, create a file that will export your store `Provider` and `useSynapse` hook:

```tsx
// app/lib/synaptik.ts
import { createSynaptik, Synapse } from 'synaptik';
import * as stores from './stores';

const { Provider, useSynapse } = createSynaptik(new Synapse(stores));

export type Stores = typeof stores;
export { Provider, useSynapse };
```

Lastly, wrap your application with the `Provider`.

```tsx
import { render } from 'react-dom';
import { Provider } from 'app/lib/synaptik';

/*
  `stores` look something like the following. The keys are used as
  identifier's when accessing the store during render.
  {
    todos: TodoStore,
    ...etc
  }
*/

const App = () => (
  <Provider>
    <Entry />
  </Provider>
);

render(<App />, window.root);
```

Now, you can access your stores and state with the `useSynapse` hook:

> NOTE: if your selector functions returns non-primitive values in an array,
> you must mark the array `as const` for Typescript to properly infer the signatures of the destructured elements

```tsx
import { useSynapse } from 'app/lib/synaptik';

function TodoList() {
  const [todos, input, updateInput, addTodo] = useSynapse(
    ({ todos }) =>
      [todos.state.entries, todos.state.input, todos.updateInput, todos.addTodo] as const
  );

  return (
    <>
      <ul>
        {todos.map(todo => (
          <li>{todo}</li>
        ))}
      </ul>

      <form onSubmit={addTodo}>
        <input value={input} onChange={updateInput} />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
```

🚀 You've done it! You have your first todo app up and running 3 simple steps.

## LICENSE

[MIT License](LICENSE) © [HeyDoctor, LLC.](heydoctor.com)
