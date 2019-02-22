import React, { Fragment } from 'react';
import { render } from 'react-dom';
import { Provider } from '../src';
import * as stores from './stores';
import TodoList from './components/todo-list';
import WeatherForecast from './components/weather-forecast';
import logger from '../logger';

const App = () => (
  <Provider stores={stores} logger={logger}>
    <Fragment>
      <TodoList />
      <WeatherForecast zipCode={94133} />
    </Fragment>
  </Provider>
);

render(<App />, window.root);
