import { useState } from 'react';
import { Button } from '../ui/Button';
import { ValuesDisplay } from './ValuesDisplay';
import { TestResultDisplay } from './TestResultDisplay';
import { TestButtonList } from './TestButtonList';
import { testCases } from '@/mock-data/mock-test-cases';
import { Loader2 } from 'lucide-react';

export const TestCases = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [testResult, setTestResult] = useState<number | null>(null);
  const [testsRun, setTestsRun] = useState(false);
  const [loading, setLoading] = useState(false);

  const localTestCases = testCases;

  const runTests = () => {
    setLoading(true);
    setTimeout(() => {
      const passedCount = localTestCases.filter(
        (tc) => tc.output === tc.expected
      ).length;
      setTestResult(passedCount);
      setTestsRun(true);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="w-full h-full text-white p-3">
      <div className="flex gap-2 mb-4 items-center">
        <TestButtonList
          testCases={localTestCases}
          activeTab={activeTab}
          testsRun={testsRun}
          onTabChange={setActiveTab}
        />
        <div className="flex items-center ml-auto gap-4">
          <TestResultDisplay
            result={testResult}
            total={localTestCases.length}
          />
          <Button
            className="bg-green-700 hover:bg-green-600"
            onClick={runTests}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2" /> Running..
              </>
            ) : (
              'Run'
            )}
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
