import { useVerifyFunction } from '../hooks/useTestCaseVerifier';
// const add = (a: number, b: number) => a + b;
const multiply = (a: number, b: number) => a * b;

const testCases = [
  { id: '1', inputs: [1, 1], expectedOutput: 2 },
  { id: '2', inputs: [2, 3], expectedOutput: 5 },
  { id: '3', inputs: [5, 5], expectedOutput: 10 },
];

export const TestCaseVerifier = () => {
  const { results, isRunning, hasRun, runVerification, reset, allPassed } =
    useVerifyFunction(multiply, testCases);

  return (
    <div>
      <h2>Test useVerifyFunction</h2>
      <button
        onClick={runVerification}
        disabled={isRunning}
      >
        {isRunning ? 'Running...' : 'Run Verification'}
      </button>
      <button
        onClick={reset}
        disabled={isRunning}
      >
        Reset
      </button>
      <p>Has Run: {hasRun ? 'Yes' : 'No'}</p>
      <p>All Passed: {allPassed ? '✅' : '❌'}</p>
      <ul>
        {results.map((result, index) => (
          <li key={index}>
            Test {testCases[index].id}: {result ? '✅ Passed' : '❌ Failed'}
          </li>
        ))}
      </ul>
    </div>
  );
};
