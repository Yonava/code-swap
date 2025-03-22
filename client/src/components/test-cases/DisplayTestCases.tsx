import React from 'react';

export type DisplayTestCaseProps = {
  input: string;
  output: string;
  expected: string;
};

export const DisplayTestCase: React.FC<DisplayTestCaseProps> = ({
  input,
  output,
  expected,
}) => {
  return (
    <div>
      <p className="font-bold">Input:</p>
      <input
        className="w-full p-2 mb-2 border border-gray-300 rounded"
        value={input}
        readOnly
      />
      <p className="font-bold">Output:</p>
      <input
        className="w-full p-2 mb-2 border border-gray-300 rounded"
        value={output}
        readOnly
      />
      <p className="font-bold">Expected:</p>
      <input
        className="w-full p-2 border border-gray-300 rounded"
        value={expected}
        readOnly
      />
    </div>
  );
};
