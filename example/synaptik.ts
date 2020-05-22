import { createSynaptik, Synapse, logger } from '../src';
import * as stores from './stores';

export type Stores = typeof stores;
export const { Provider, useSynapse } = createSynaptik(new Synapse(stores));
