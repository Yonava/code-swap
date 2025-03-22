import { useState } from 'react';
import { Button } from '../ui/Button';
import { DisplayTestCase } from './DisplayTestCases';

export const TestCases = () => {
  const [activeTab, setActiveTab] = useState(1);

  const testCases = [
    { id: 1, input: '[3,3]', output: '[3,3]', expected: '6' },
    { id: 2, input: '[1,2,3]', output: '5', expected: '[1,2,3]' },
    { id: 3, input: '[2,4,6]', output: '10', expected: '[2,4,6]' },
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
            <DisplayTestCase
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
