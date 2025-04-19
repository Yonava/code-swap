import { CodeEditor } from '@/components/CodeEditor';
// import { ProblemStatement } from '@/components/ProblemStatement';
import { TitledContainer } from '@/components/TitledContainer';
import { useState, useContext, useEffect } from 'react';
import { ExperimentalPanel } from './ExperimentalPanel';
import { WaitingRoom } from '@/components/waiting-room/WaitingRoom';
import MatchContext from './MatchContext';
import { useMatchSocket } from './useMatchSocket';
import { useSearchParams } from 'react-router';
import { MATCH_ACTIONS } from './MatchActions';

const ChallengeView = () => {
  const [code, setCode] = useState<string>('console.log("hello world")');
  const handleCodeChange = (value: string) => setCode(value);

  const ctx = useContext(MatchContext)
  const dispatch = ctx.dispatch
  const socket = useMatchSocket(ctx)

  const [searchParams] = useSearchParams()

  useEffect(() => {
    const matchId = searchParams.get('matchId')
    const teamIndex = searchParams.get('team')
    if (!matchId || !teamIndex) return
    dispatch({
      type: MATCH_ACTIONS.SET_MATCH_ID,
      payload: `${matchId}-${teamIndex}`
    })
    dispatch({
      type: MATCH_ACTIONS.SET_PLAYER_ID,
      payload: Math.random().toString().slice(2, 8)
    })
  }, [dispatch, searchParams])

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
