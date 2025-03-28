import { TestField } from './TestField';

export type TestsDisplayProps = {
  input: string;
  output: string;
  expected: string;
};

export function ValuesDisplay({ input, output, expected }: TestsDisplayProps) {
  return (
    <div className="space-y-2">
      <TestField
        title="Input:"
        value={input}
      />
      <TestField
        title="Your Output:"
        value={output}
      />
      <TestField
        title="Expected:"
        value={expected}
      />
    </div>
  );
}
