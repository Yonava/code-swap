import { Button } from '../ui/Button';

interface TestCaseButtonProps {
  id: number;
  isActive: boolean;
  isPassed: boolean;
  testsRun: boolean;
  onClick: () => void;
}

export const TestCaseButton = ({
  id,
  isActive,
  isPassed,
  testsRun,
  onClick,
}: TestCaseButtonProps) => {
  return (
    <Button
      key={id}
      className={`default hover:bg-primary shadow-none ${
        isActive ? '' : 'bg-transparent'
      } ${testsRun ? (isPassed ? 'text-green-500' : 'text-red-500') : ''}`}
      onClick={onClick}
    >
      Case {id}
    </Button>
  );
};
