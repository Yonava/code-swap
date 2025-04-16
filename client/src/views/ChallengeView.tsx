import { CodeEditor } from '@/components/CodeEditor';
// import { ProblemStatement } from '@/components/ProblemStatement';
import { TitledContainer } from '@/components/TitledContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSocket } from './useSocket';
import { useState } from 'react';

const ChallengeView = () => {
  const { connect, isConnected, isConnecting, register, createMatch, joinMatch } = useSocket();
  const [code, setCode] = useState<string>('console.log("hello world")');
  const [playerId, setPlayerId] = useState('');
  const [matchId, setMatchId] = useState('');

  const handleCodeChange = (value: string) => {
    setCode(value);
  };

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
        <TitledContainer
          title="Experimental Stuff"
          width="25%"
        >
          <div className="p-2">
            <Input
              className='bg-white mb-2'
              placeholder='playerId'
              onChange={(ev) => setPlayerId(ev.target.value)}
            />
            <Input
              className='bg-white mb-2'
              placeholder='matchId'
              onChange={(ev) => setMatchId(ev.target.value)}
            />
            <div className="flex gap-1 flex-col">
              {
                !isConnected &&
                <Button
                  onClick={() => connect()}
                >
                  Connect
                </Button>
              }
              {
                isConnected &&
                <Button
                  disabled
                  onClick={() => {
                    console.log('socket connected');
                  }}
                >
                  Connected
                </Button>
              }
              {
                isConnecting &&
                <Button
                  disabled
                >
                  Connecting...
                </Button>
              }
              <Button
                onClick={() => {
                  register(playerId)
                }}
                disabled={!isConnected}
              >
                Register
              </Button>
              <Button
                onClick={() => {
                  createMatch(playerId)
                }}
                disabled={!isConnected}
              >
                Create Match
              </Button>
              <Button
                onClick={() => {
                  joinMatch(playerId, matchId)
                }}
                disabled={!isConnected}
              >
                Join Match
              </Button>
            </div>
          </div>
        </TitledContainer>
      </div>
    </>
  );
};

export default ChallengeView;
