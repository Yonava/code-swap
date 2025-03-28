import { useState } from 'react';
import { Button } from '../ui/Button';
import { ValuesDisplay } from './ValuesDIsplay';
import { TestResultDisplay } from './TestResultDisplay';
import { testCases } from '@/mock-data/mock-test-cases';

export const TestCases = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [testResult, setTestResult] = useState<number | null>(null);
  const [testsRun, setTestsRun] = useState(false);

  const localTestCases = testCases;

  const runTests = () => {
    const passedCount = localTestCases.filter(
      (tc) => tc.output === tc.expected
    ).length;
    setTestResult(passedCount);
    setTestsRun(true);
  };

  return (
    <div className="w-full h-full text-white p-3">
      <div className="flex gap-2 mb-4 items-center">
        {localTestCases.map((tc) => {
          const isPassed = tc.output === tc.expected;
          return (
            <Button
              key={tc.id}
              className={`default hover:bg-primary shadow-none ${
                activeTab === tc.id ? '' : 'bg-transparent'
              } ${
                testsRun ? (isPassed ? 'text-green-500' : 'text-red-500') : ''
              }`}
              onClick={() => setActiveTab(tc.id)}
            >
              Case {tc.id}
            </Button>
          );
        })}
        <div className="flex items-center ml-auto gap-4">
          <TestResultDisplay
            result={testResult}
            total={localTestCases.length}
          />
          <Button
            className="bg-green-700 hover:bg-green-600"
            onClick={runTests}
          >
            Run
          </Button>
        </div>
      </div>
      {localTestCases.map(
        (tc) =>
          activeTab === tc.id && (
            <ValuesDisplay
              key={tc.id}
              input={tc.input}
              output={tc.output}
              expected={tc.expected}
            />
          )
      )}
    </div>
  );
};
