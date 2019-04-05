import { useMemo, useLayoutEffect } from 'react';
import { createHook as createHookCore } from 'hookleton';

export function createHook() {
  const hook = createHookCore.apply(null, arguments);
  let h;
  function use() {
    const host = useMemo(() => !h && (h = true), []);
    return host ? (useLayoutEffect(() => () => (h = false), []), hook.use()) : hook();
  }
  function useFn() {
    return use();
  }
  useFn.get = hook.get;
  return useFn;
}
