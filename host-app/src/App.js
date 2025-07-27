import { Suspense, lazy } from 'react';
const RemoteReactApp = lazy(() => import('remoteReact/App'));
const RemoteVueApp = lazy(() => import('./VueRemote'));

function App() {

  return (
    <div style={{ width: '100vw', height: '100vh'}}>
      <h2>Host App in React</h2>
      <div style={{display: 'flex', width: '100%', gap: '20px'}}>
          <Suspense fallback="Loading React remote…">
            <div style={{ minHeight: '200px' }}>
              <RemoteReactApp />
            </div>
          </Suspense>

          <Suspense fallback="Loading Vue remote…">
            <div style={{ minHeight: '200px' }}>
              <RemoteVueApp />
            </div>
          </Suspense>
      </div>
    </div>
  );
}

export default App;
