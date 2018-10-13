import React, { Fragment } from 'react';
import { render } from 'react-dom';
import { Provider as VaultProvider } from '../src/revault';
import * as stores from './stores';
import TodoList from './components/todo-list';
import WeatherForecast from './components/weather-forecast';
import logger from '../logger';

const App = () => (
  <VaultProvider stores={stores} logger={logger}>
    <Fragment>
      <TodoList />
      <WeatherForecast zipCode={94133} />
    </Fragment>
  </VaultProvider>
);

render(<App />, window.root);
