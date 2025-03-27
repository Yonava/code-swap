import { useState } from 'react';
import { Button } from '../ui/Button';
import { TestCase } from './TestCase';
import { testCases } from '@/mock-data/mock-test-cases';

export const TestCases = () => {
  const [activeTab, setActiveTab] = useState(1);

  const localTestCases = testCases;

  return (
    <div className="w-full h-full bg-gray-400 text-black p-3">
      <div className="flex gap-2 mb-4">
        {localTestCases.map((tc) => (
          <Button
            key={tc.id}
            className={`p-2 ${activeTab === tc.id ? 'bg-gray-900 text-white' : 'bg-gray-600'}`}
            onClick={() => setActiveTab(tc.id)}
          >
            Case {tc.id}
          </Button>
        ))}
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
