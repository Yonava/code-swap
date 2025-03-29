import { TestCaseButton } from './TestCaseButton';

interface TestCaseListProps {
  testCases: { id: number; output: string; expected: string }[];
  activeTab: number;
  testsRun: boolean;
  onTabChange: (id: number) => void;
}

export const TestButtonList = ({
  testCases,
  activeTab,
  testsRun,
  onTabChange,
}: TestCaseListProps) => {
  return (
    <>
      {testCases.map((tc) => {
        const isPassed = tc.output === tc.expected;
        return (
          <TestCaseButton
            key={tc.id}
            id={tc.id}
            isActive={activeTab === tc.id}
            isPassed={isPassed}
            testsRun={testsRun}
            onClick={() => onTabChange(tc.id)}
          />
        );
      })}
    </>
  );
};
