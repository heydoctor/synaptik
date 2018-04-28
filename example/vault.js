import { createVault } from '../src';
import todos from './stores/todos';
import weather from './stores/weather';

const vault = createVault({
  todos,
  weather,
});

export default vault;
