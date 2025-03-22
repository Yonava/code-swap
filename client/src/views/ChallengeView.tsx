import { CodeEditor } from '@/components/CodeEditor';
import { ProblemStatement } from '@/components/ProblemStatement';
import { TitledContainer } from '@/components/TitledContainer';
import { TestCases } from '@/components/test-cases/TestCasesParent';

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

        <div className="flex flex-col h-full padding-2 gap-2 w-[75%]">
          <TitledContainer
            title="Code"
            width="100%"
          >
            <CodeEditor />
          </TitledContainer>
          <div className="h-[50%]">
            <TitledContainer
              title="Test Cases"
              width="100%"
            >
              <TestCases />
            </TitledContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChallengeView;
