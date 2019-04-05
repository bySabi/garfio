<h1 align="center">
  <p align="center" style="font-size: 1em">GARFIO</p>
</h1>

[![npm](https://img.shields.io/npm/v/garfio.svg)](https://www.npmjs.com/package/garfio)
[![Coverage Status](https://coveralls.io/repos/github/bySabi/garfio/badge.svg?branch=master)](https://coveralls.io/github/bySabi/garfio?branch=master)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://opensource.org/licenses/MIT)
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.me/bySabi/10)

Garfio is a module composed of several submodules that try to facilitate the use of the *hookletons*. A [hookleton](https://github.com/bySabi/hookleton) is a globalized React Hook, this means that once declared its namespace it is linked to a single state.

The `Hookleton` library includes only the minimum core code needed to maintain state synchronization between the users of the hookleton but was designed to be fully extensible. The submodules of `Garfio` are extensions of this code to be able to use the same hookleton *namespace* with different states.

*Garfio* solves the problem of namespaces using several user-selectable approaches. In the future, more approaches could be added if relevant.

> We recommend always take a look first to [Hookleton](https://github.com/bySabi/hookleton) package

## Benefits
- Zero dependencies (only Hookleton that depends on React Hook)
- Small size
- Works in any environment that supports React Hook: _React Native_, _React Server-Side Rendering ([next.js](https://github.com/zeit/next.js/))_, _[Proto Native](https://github.com/kusti8/proton-native)_, ...


## Install

- NPM: `npm i garfio`
- Yarn: `yarn add garfio`


## include subModules
* [Container](https://github.com/bySabi/garfio#container-module)
* [Store](https://github.com/bySabi/garfio#store-module)
* [Simple](https://github.com/bySabi/garfio#simple-module)

## Hookleton API

Garfio re-export the Hookleton API. You do not need to install hookleton module explicitly if you want to use it. Just:
 ```javascript
 // createHook from Hookleton module
 import { createHook } from 'garfio'
 ```


# `Container` module
###### Hookleton [![gzip size](http://img.badgesize.io/https://npmcdn.com/hookleton/lib/index.js?compression=gzip)]()  +  Container [![gzip size](http://img.badgesize.io/https://npmcdn.com/garfio/lib/container.js?compression=gzip)]()


*Container* create different state scopes within the enclosing tags


## API

`createHook(useHook, ...initial?): useHookleton`

### Parameters
- `useHook` is the user provide Hook
- `initial` any number of params that _useHook_ will accept

### Returns
- `useHookleton` returned Hookleton. Called by *non-host* components
- `useHookleton.Container` Container component for enclosing tags scopes
- `useHookleton.get` function that get the current output of the Hookleton.
For standalone use

## usage Example


[page](https://bysabi.github.io/garfio/counterNested/) | [source](./example/pages/counterNested.js)

```javascript
import { createHook } from 'garfio/container';

function counter(initial = 0) {
  const [count, setCount] = useState(initial);
  const increment = () => setCount(count + 1);
  return [count, increment];
}

const useCounter = createHook(counter);
const CounterContainer = useCounter.Container;

function Button() {
  const [, increment] = useCounter();
  return <button onClick={increment}>+</button>;
}

function Count() {
  const [count] = useCounter();
  return <p>{count}</p>;
}

export default () => (
  <CounterContainer initialArg={1}>
    <Count />
    <Button />
    <CounterContainer initialArg={3}>
      <Count />
      <Button />
    </CounterContainer>
  </CounterContainer>
);
```

## initial arguments API
*Containers* can be initialized in two ways:


### `initialArg` *prop*
**initialArg** is an array of arguments which is `spread` to the Hook provided by the user. If the value is not an array then it is converted. To pass an array as a start element, it must be enclosed in an array too.

Below are examples of usage and automatic conversions.

*Single argument example:*
```javascript
const useValue = createHook(useState);
const Container = useValue.Container;

export default () => {
  return (
    <Container initialArg={3}>
      { /* output number 3 */
        useValue()[0]
      }
      <Container initialArg="three">
        { /* output string "three" */
          useValue()[0]
        }
      </Container>
      <Container initialArg={[[1,2,3]]}>
        { /* output array [1,2,3] in JSX */
          useValue()[0]
        }
      </Container>
    </Container>
  );
};
```


*Multiple arguments example:*
```javascript
const useReduced = createHook(useReducer);
const Container = useValue.Container;

const reducer = (s, a) => s;
const initial = 0;

export default () => {
  return (
    <Container initialArg={[reducer, initial]}>
      { /* output number 0(initial) */
        useReduced()[0]
      }
    </Container>
  );
};
```

### initial `object properties` like *props*
When initializing hooks that use an initialization object it is possible to declare `object properties` as *props* of the Container.

*Example:*
```javascript
const useReduced = createHook(({ reducer, initial }) => useReducer(reducer, initial));
const Container = useValue.Container;

export default () => {
  return (
    <Container reducer={(s,a) => s} initial={0}>
      { /* output number 0(initial) */
        useReduced()[0]
      }
    </Container>
  );
};
```

> The *Container* API and its functionality is inspired by the [constante](https://github.com/diegohaz/constate) package although React Context has not been used for its implementation


# `Store` module
###### Hookleton [![gzip size](http://img.badgesize.io/https://npmcdn.com/hookleton/lib/index.js?compression=gzip)]()  +  Simple [![gzip size](http://img.badgesize.io/https://npmcdn.com/garfio/lib/simple.js?compression=gzip)]()  +  Store [![gzip size](http://img.badgesize.io/https://npmcdn.com/garfio/lib/store.js?compression=gzip)]()

If in *Container* we use the enclosing tags to define different hookleton scopes, with `Store` the scope is declared using any element that is a valid key of a Javascript Map.
Even so, we recommend the use of `strings` or `Symbols` to define the *Store* namespace.


## API

### store creation
`createStore(store, hook, ...initial?)`

* `store` unique identifier. Ex: string | Symbol
* `useHook` is the user provide Hook
* `initial` any number of params that useHook will accept


### store `use`
`useStore(store, ...initial?): any`

* `store` unique identifier. Ex: string | Symbol
* `initial` any number of params that useHook will accept

Return value is any value returned by the user's Hook

### standalone store
`getStore(store): any`

* `store` unique identifier. Ex: string | Symbol

> Standalone refers to obtaining the current state of the hookleton from any part of the application, including outside the React components. This state is not updated automatically

### remove store

`removeStore(store): boolean`

* `store` unique identifier. Ex: string | Symbol

Return `true` on sucess

## usage Example

```javascript
import { createStore, useStore, getStore } from 'garfio/store';

const three = Symbol();

createStore('1', useState, 1);
createStore('two', useState, 2);
createStore(three, useReducer);

const reducer = (s, a) => s;

const Values = () => {
  const [one, setOne] = useStore('1');
  useStore('two');
  const [two] = getStore('two');
  const [three, dispatch] = useStore(three, reducer, 3);
  // output: 1,two,3
  return (
    <span>
      {one},{two},{three}
    </span>
  );
};

export default () => <Values />;
```
> The Store API and its functionality is inspired in packages like: 
 [shared-state-hook](https://github.com/magnumjs/shared-state-hook),
 [react-hook-shared-state](https://github.com/philippguertler/react-hook-shared-state),
 [reactn](https://github.com/CharlesStover/reactn),
 [react-shared-hooks](https://github.com/dimapaloskin/react-shared-hooks),
 [react-hookstore](https://github.com/jhonnymichel/react-hookstore)
 

# `Simple` module
###### Hookleton [![gzip size](http://img.badgesize.io/https://npmcdn.com/hookleton/lib/index.js?compression=gzip)]()  +  Simple [![gzip size](http://img.badgesize.io/https://npmcdn.com/garfio/lib/simple.js?compression=gzip)]()

`Simple` module does not add anything new. It simply allows you to use a hookleton without being explicit about the component that will act as *the host* of the hookleton. In other words, you do not need to use the `useHookleton.use()` API, just `useHookleton()`


## API
`createHook(useHook, ...initial): useHookleton`

### Parameters
- `useHook` is the user provide Hook
- `initial` any number of params that _useHook_ will accept

> **initial** params are required. Any param used in `useHookleton` are ignored.

### Returns
- `useHookleton` returned Hookleton. Called by *non-host* components
- `useHookleton.get` function that get the current output of the Hookleton.
For standalone use


## usage Example

[page](https://bysabi.github.io/garfio/counter/) | [source](./example/pages/counter.js)

```javascript
import { createHook } from 'garfio/simple';

// useCounter is a useState but global
const useCounter = createHook(useState, 0);

const Increment = () => {
  const [, update] = useCounter();
  const increment = () => update(s => s + 1);
  return <button onClick={increment}>+</button>;
};

// The host component
const Value = () => {
  const [count] = useCounter();
  return <span>{count}</span>;
};

export default () => (
  <div>
    <Value />
    <Increment />
  </div>
);

```


# more Examples

Examples [page](https://bysabi.github.io/garfio/) include:

- Nested Counters with "Container" [page](https://bysabi.github.io/garfio/counterNested/) | [source](./example/pages/counterNested.js)
- Counters 10x40 with "Store" [page](https://bysabi.github.io/garfio/counters10x40/) | [source](./example/pages/counters10x40.js)
- Counter with "Simple" [page](https://bysabi.github.io/garfio/counter/) | [source](./example/pages/counter.js)


# for a deeper insight ...
Please read *Hookleton* [Doc](https://github.com/bySabi/hookleton/blob/master/README.md)


## Credits

### author

- Félix A.A. <> [@bySabi](https://github.com/bySabi)

### Contributing

- Documentation improvement
- Feel free to send any PR

## License

[MIT](./LICENSE)