import { CodeEditor } from '@/components/CodeEditor';
import { ProblemStatement } from '@/components/ProblemStatement';
import { TitledContainer } from '@/components/TitledContainer';
import { WaitingRoom } from '@/components/waiting-room/WaitingRoom';
import { useMatchContext } from '@/state/match/useMatchContext';

const ChallengeView = () => {
  const { challenge } = useMatchContext()

  return (
    <>
      <div className="flex bg-gray-900 w-[100vw] h-[100vh] relative p-2 gap-2">
        <TitledContainer
          title="Problem Statement"
          width="35%"
        >
          <div className="overflow-auto p-2 text-gray-100 h-full">
            <ProblemStatement />
          </div>
        </TitledContainer>
        <TitledContainer
          title={challenge?.isFinished ? 'Code (Submitted)' : 'Code'}
          width="65%"
        >
          <CodeEditor />
        </TitledContainer>
      </div>

      <WaitingRoom />
    </>
  );
};

export default ChallengeView;
