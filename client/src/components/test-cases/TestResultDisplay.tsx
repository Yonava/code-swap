interface TestResultDisplayProps {
  result: number | null;
  total: number;
}

export const TestResultDisplay = ({
  result,
  total,
}: TestResultDisplayProps) => {
  if (result === null) return null;

  return (
    <span className="text-white font-bold text-sm">
      {result}/{total} Test Cases Passed
    </span>
  );
};
