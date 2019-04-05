import { useMemo, Fragment, createElement } from 'react';
import { Hookleton as HookletonCore } from 'hookleton';

export function createHook(useHook, ...initial) {
  const hookleton = new Hookleton(useHook, initial);
  // non-Host hook
  function useFn() {
    return hookleton.use.apply(hookleton, arguments);
  }
  // for use standalone
  useFn.get = function() {
    return hookleton.get.call(hookleton);
  };
  // Containers
  useFn.Container = createContainer(hookleton);
  return useFn;
}

function createContainer(hookleton) {
  const Container = props => {
    const { children, ...initial } = props;
    return createElement(
      Fragment,
      null,
      createElement(_hookleton, { hookleton, initial }),
      children,
      createElement(__hookleton, { hookleton })
    );
  };
  Container.displayName = 'HookletonContainer';
  return Container;
}

// the object `{ initial }` will be use as ctx object for the calling container
const _hookleton = ({ hookleton, initial }) => (hookleton._useH({ initial }), null);
const __hookleton = ({ hookleton }) => (hookleton.__useH(), null);

export class Hookleton extends HookletonCore {
  constructor(useHook, initial) {
    super(useHook, initial);
    this._cx = [];
  }

  _useH(cx) {
    const ctx = useMemo(() => this._initCtnr(cx), []);
    return this._use(ctx); // this method come from HookletonCore
  }

  // init Container
  _initCtnr(ctx) {
    ctx.up = new Map();
    // This 'initial' come from <hookleton Container value={ props }> and always has priority
    if (Object.keys(ctx.initial).length !== 0) {
      // **IMPORTANT** 'initialArg' is passed like array of arguments. Ex
      //   <Counter initialArg={[reducer, initialState]}> is untouched.
      //   <Counter initialArg="example"> is converted to ["example"]
      // When a user need to pass an array has to be done this way
      //   <Counter initialArg={[[1,2,4]]} >
      const initialArg = ctx.initial.initialArg;
      if (initialArg) {
        ctx.arg = Array.isArray(initialArg) ? initialArg : [initialArg];
      } else {
        ctx.arg = [ctx.initial];
      }
    } else {
      ctx.arg = this._arg;
    }
    // add current `ctx` when the Container is rendered first time
    this._cx.push(ctx);
    return ctx;
  }

  __useH() {
    // remove current `ctx` when the end of the Container is reached
    return useMemo(() => this._cx.pop(), []);
  }

  use() {
    const ctx = useMemo(() => {
      // The last element of '_ctx' will be `ctx` object of the current container
      const cx = this._cx[this._cx.length - 1];
      if (cx) {
        return cx;
      }
      console.error("[Hookleton/garfio] missing 'Container'");
      // Return a dummy ctx `{ out: [] }` when a container is not provided. This prevent runtime exceptions
      return { out: [] };
    }, []);
    return this.useNonHost(ctx, arguments); // this method come from HookletonCore
  }

  get() {
    const cx = this._cx[this._cx.length - 1];
    return cx ? cx.out : [];
  }
}
