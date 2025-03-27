import { useState } from 'react';
import { Button } from '../ui/Button';
import { TestCase } from './TestCase';
import { testCases } from '@/mock-data/mock-test-cases';

export const TestCases = () => {
  const [activeTab, setActiveTab] = useState(1);

  const localTestCases = testCases;

  return (
    <div className="w-full h-full text-white p-3">
      <div className="flex gap-2 mb-4">
        {localTestCases.map((tc) => (
          <Button
            key={tc.id}
            className={`default hover:bg-primary shadow-none ${activeTab === tc.id ? '' : 'bg-transparent'}`}
            onClick={() => setActiveTab(tc.id)}
          >
            Case {tc.id}
          </Button>
        ))}
        <Button className="bg-green-700 hover:bg-green-600 ml-auto">Run</Button>
      </div>
      {localTestCases.map(
        (tc) =>
          activeTab === tc.id && (
            <TestCase
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
