import { CodeEditor } from '@/components/CodeEditor';
// import { ProblemStatement } from '@/components/ProblemStatement';
import { TitledContainer } from '@/components/TitledContainer';
import { useState, useContext } from 'react';
import { ExperimentalPanel } from './ExperimentalPanel';
import { WaitingRoom } from '@/components/waiting-room/WaitingRoom';
import MatchContext from './MatchContext';
import { useMatchSocket } from './useSocket';

const ChallengeView = () => {
  const [code, setCode] = useState<string>('console.log("hello world")');
  const handleCodeChange = (value: string) => setCode(value);

  const ctx = useContext(MatchContext)
  const socket = useMatchSocket(ctx)

  return (
    <>
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
        <ExperimentalPanel socket={socket} />
      </div>

      <WaitingRoom
        startMatch={socket.startMatch}
        leaveMatch={socket.leaveMatch}
      />
    </>
  );
};

export default ChallengeView;
