// VueRemote.jsx
import React, { useLayoutEffect, useRef } from 'react';

export default function VueRemote() {
  const elRef = useRef(null);

  useLayoutEffect(() => {
    let unmountVue;
    (async () => {
      const mod = await import('remoteVue/App');
      const mount = mod.default || mod.mount;
      unmountVue = mount(elRef.current);
    })();
    return () => unmountVue?.();
  }, []);

  return <div ref={elRef} />;
}
