import { createStore } from 'redux';
import stringReducer from './reducer';

const store = createStore(stringReducer);

export default store;