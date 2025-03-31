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
      className={`default bg-surface-bright hover:bg-surface-bright active:bg-surface-bright/80 shadow-none ${
        isActive ? '' : 'bg-transparent'
      } ${testsRun ? (isPassed ? 'text-green-400' : 'text-red-400') : ''}`}
      onClick={onClick}
    >
      Case {id}
    </Button>
  );
};
