import { CodeEditor } from '@/components/CodeEditor';
import { ProblemStatement } from '@/components/ProblemStatement';
import { TitledContainer } from '@/components/TitledContainer';
import { TestCases } from '@/components/TestCases';

const ChallengeView = () => {
  return (
    <>
      <div className="flex bg-gray-900 w-[100vw] h-[100vh] relative p-2 gap-2">
        <TitledContainer
          title="Challenge Question"
          width="25%"
        >
          <div className="overflow-auto p-2 text-gray-100">
            <ProblemStatement />
          </div>
        </TitledContainer>
        <TitledContainer
          title="Code"
          width="75%"
        >
          <div className="flex flex-col h-full">
            <div className="flex-auto">
              <CodeEditor />
            </div>
            <div className="mt-2 flex-none">
              <TestCases />
            </div>
          </div>
        </TitledContainer>
      </div>
    </>
  );
};

export default ChallengeView;
