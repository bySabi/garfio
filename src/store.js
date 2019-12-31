import { createHook } from './simple';

const stores = new Map();

export function createStore(hook, ...initial) {
  const store = {};
  stores.set(store, createHook.apply(null, [hook].concat(initial)));
  store.get = () => getStore(store).get();
  store.delete = () => stores.delete(store);
  return store;
}

function getStore(store) {
  return stores.get(store);
}

export function useStore(store, ...initial) {
  const hook = getStore(store);
  return hook
    ? hook.apply(null, initial)
    : console.error(`[Garfio/store] the store ${JSON.stringify(store)} was not found`);
}
