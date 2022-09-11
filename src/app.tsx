import React, { Suspense, lazy, useState } from 'react';

const ComputedOne = lazy(() => import('./components/ComputedOne'));
const ComputedTwo = lazy(() => import('./components/ComputedTwo'));

function App() {
  const [showTwo, setShowTwo] = useState<boolean>(false);

  return (
    <div className="app-content">
      <Suspense fallback={<div>loading...</div>}>
        <ComputedOne a={1} b={2} />
        {showTwo && <ComputedTwo a={3} b={4} />}
        <button type="button" onClick={() => setShowTwo(!showTwo)}>
          显示Two
        </button>
      </Suspense>
    </div>
  );
}

export default App;
