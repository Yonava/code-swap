import { useState } from 'react';
import { Button } from '../ui/Button';
import { TestCase } from './TestCase';

export const TestCases = () => {
  const [activeTab, setActiveTab] = useState(1);

  const testCases = [
    { id: 1, input: '[3,3]', output: '6', expected: '6' },
    { id: 2, input: '[1,2,3]', output: '6', expected: '6' },
    { id: 3, input: '[2,4,6]', output: '12', expected: '12' },
    { id: 4, input: '[2,4,6]', output: '13', expected: '12' },
    { id: 5, input: '[2,4,6]', output: '14', expected: '12' },
  ];

  return (
    <div className="w-full h-full bg-gray-400 text-black p-3">
      <div className="flex gap-2 mb-4">
        {testCases.map((tc) => (
          <Button
            key={tc.id}
            className={`p-2 ${activeTab === tc.id ? 'bg-gray-900 text-white' : 'bg-gray-600'}`}
            onClick={() => setActiveTab(tc.id)}
          >
            Case {tc.id}
          </Button>
        ))}
      </div>
      {testCases.map(
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
