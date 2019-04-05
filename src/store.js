import { createHook } from './simple';

const stores = new Map();

export function createHookStore(create, store, hook, ...initial) {
  if (!stores.get(store)) {
    stores.set(store, create.apply(null, [hook].concat(initial)));
  } else {
    console.error(`[Garfio/store] the store ${JSON.stringify(store)} already exist`);
  }
}

export function createStore(store, hook, ...initial) {
  createHookStore.apply(null, [createHook, store, hook].concat(initial));
}

export function useStore(store, ...initial) {
  const hook = stores.get(store);
  return hook ? hook.apply(null, initial) : storeNotFound(store);
}

export function getStore(store) {
  const hook = stores.get(store)
  return hook ? hook.get() : storeNotFound(store);
}

export function removeStore(store) {
  return stores.delete(store);
}

function storeNotFound(store) {
  console.error(`[Garfio/store] the store ${JSON.stringify(store)} was not found`);
  return [];
}
