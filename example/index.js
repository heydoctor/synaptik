import React, { Fragment } from 'react';
import { render } from 'react-dom';
import { Provider, logger } from '../src';
import * as stores from './stores';
import TodoList from './components/todo-list';
import WeatherForecast from './components/weather-forecast';
import Counter from './components/counter';

const App = () => (
  <Provider stores={stores} logger={logger}>
    <Fragment>
      <TodoList />
      <WeatherForecast zipCode={94133} />
      <Counter />
    </Fragment>
  </Provider>
);

render(<App />, window.root);
