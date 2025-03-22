import { DisplayInput } from './DisplayInput';

export type TestsDisplayProps = {
  input: string;
  output: string;
  expected: string;
};

export function TestsDisplay({ input, output, expected }: TestsDisplayProps) {
  return (
    <div>
      <DisplayInput
        title="Input:"
        value={input}
      />
      <DisplayInput
        title="Output:"
        value={output}
      />
      <DisplayInput
        title="Expected:"
        value={expected}
      />
    </div>
  );
}
