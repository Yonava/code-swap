import { useState } from 'react';
import { Button } from '../ui/Button';
import { ValuesDisplay } from './ValuesDIsplay';
import { TestResultDisplay } from './TestResultDisplay';
import { testCases } from '@/mock-data/mock-test-cases';

export const TestCases = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [testResult, setTestResult] = useState<'pass' | 'fail' | null>(null);

  const localTestCases = testCases;

  const runTests = () => {
    const activeTestCase = localTestCases.find((tc) => tc.id === activeTab);
    if (activeTestCase) {
      const passed = activeTestCase.output === activeTestCase.expected;
      setTestResult(passed ? 'pass' : 'fail');
    }
  };

  return (
    <div className="w-full h-full text-white p-3">
      <div className="flex gap-2 mb-4 items-center">
        {localTestCases.map((tc) => (
          <Button
            key={tc.id}
            className={`default hover:bg-primary shadow-none ${activeTab === tc.id ? '' : 'bg-transparent'}`}
            onClick={() => setActiveTab(tc.id)}
          >
            Case {tc.id}
          </Button>
        ))}
        <div className="flex items-center ml-auto gap-4">
          <TestResultDisplay result={testResult} />
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
