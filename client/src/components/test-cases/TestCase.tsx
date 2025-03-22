import { TestValues } from './TestValues';

export type TestsDisplayProps = {
  input: string;
  output: string;
  expected: string;
};

export function TestCase({ input, output, expected }: TestsDisplayProps) {
  return (
    <div className="space-y-2">
      <TestValues
        title="Input:"
        value={input}
      />
      <TestValues
        title="Output:"
        value={output}
      />
      <TestValues
        title="Expected:"
        value={expected}
      />
    </div>
  );
}
