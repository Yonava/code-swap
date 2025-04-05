import { useVerifyFunction } from '../hooks/testCases/useTestCaseVerifier';
import { useParseFunction } from '../hooks/testCases/parseFunction';
import { useState } from 'react';

const testCases = [
  { id: '1', inputs: [1, 1], expectedOutput: 2 },
  { id: '2', inputs: [2, 3], expectedOutput: 5 },
  { id: '3', inputs: [5, 5], expectedOutput: 10 },
];

export const TestCaseVerifier = () => {
  const initialCode = '(x, y) => { return x + y }';
  const [codeString, setCodeString] = useState<string>(initialCode);
  const { func, error, isLoading } = useParseFunction(codeString);
  const { results, isRunning, hasRun, runVerification, reset, allPassed } =
    useVerifyFunction(func, testCases);

  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Test Function Verifier</h2>

      <div className="mb-4">
        <label className="block mb-2">
          Edit function code:
          <textarea
            className="w-full p-2 border rounded font-mono"
            rows={6}
            value={codeString}
            onChange={(e) => {
              setCodeString(e.target.value);
              reset();
            }}
            placeholder="const add = (x, y) => { return x + y }"
          />
        </label>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
          onClick={runVerification}
          disabled={isRunning || !func}
        >
          {isRunning ? 'Running...' : 'Run Verification'}
        </button>

        <button
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:bg-gray-300"
          onClick={reset}
          disabled={isRunning || !hasRun}
        >
          Reset
        </button>
      </div>

      <div className="mb-4">
        <p>Has Run: {hasRun ? 'Yes' : 'No'}</p>
        {hasRun && <p>All Tests: {allPassed ? '✅ Passed' : '❌ Failed'}</p>}
      </div>

      {hasRun && (
        <div className="border rounded p-4">
          <h3 className="font-bold mb-2">Test Results:</h3>
          <ul className="space-y-2">
            {results.map((result, index) => (
              <li
                key={index}
                className={`p-2 rounded ${result ? 'bg-green-100' : 'bg-red-100'}`}
              >
                Test {testCases[index].id} (
                {JSON.stringify(testCases[index].inputs)} →{' '}
                {testCases[index].expectedOutput}):
                {result ? ' ✅ Passed' : ' ❌ Failed'}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
