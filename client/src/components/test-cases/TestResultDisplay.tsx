interface TestResultDisplayProps {
  result: 'pass' | 'fail' | null;
}

export const TestResultDisplay = (props: TestResultDisplayProps) => {
  if (props.result === null) return null;

  return (
    <span
      className={`${
        props.result === 'pass' ? '!text-green-500' : '!text-red-500'
      } font-bold text-sm`}
    >
      {props.result === 'pass' ? 'Test passed!' : 'Test failed!'}
    </span>
  );
};
