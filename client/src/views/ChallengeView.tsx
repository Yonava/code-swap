import { CodeEditor } from '@/components/CodeEditor';
// import { ProblemStatement } from '@/components/ProblemStatement';
import { TitledContainer } from '@/components/TitledContainer';
import { useState } from 'react';
import { MatchContextProvider } from './MatchContext';
import { ExperimentalPanel } from './ExperimentalPanel';

const ChallengeView = () => {
  const [code, setCode] = useState<string>('console.log("hello world")');

  const handleCodeChange = (value: string) => {
    setCode(value);
  };

  return (
    <>
      <MatchContextProvider>
        <div className="flex bg-gray-900 w-[100vw] h-[100vh] relative p-2 gap-2">
          {/* <TitledContainer
          title="Challenge Question"
          width="25%"
        >
          <div className="overflow-auto p-2 text-gray-100">
            <ProblemStatement />
          </div>
        </TitledContainer> */}
          <TitledContainer
            title="Code"
            width="75%"
          >
            <CodeEditor value={code} onChange={handleCodeChange} />
          </TitledContainer>
          <ExperimentalPanel />
        </div>
      </MatchContextProvider>
    </>
  );
};

export default ChallengeView;
