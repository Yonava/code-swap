import { CodeEditor } from '@/components/CodeEditor';
// import { ProblemStatement } from '@/components/ProblemStatement';
import { TitledContainer } from '@/components/TitledContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSocket } from './useSocket';
import { useState } from 'react';

const ChallengeView = () => {
  const { connect, isConnected, isConnecting, join } = useSocket();
  const [userId, setUserId] = useState<string>('');

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
          <CodeEditor />
        </TitledContainer>
        <TitledContainer
          title="Experimental Stuff"
          width="25%"
        >
          <div className="p-2">
            <Input
              className='bg-white mb-2'
              placeholder='user id'
              onChange={(ev) => setUserId(ev.target.value)}
            />
            <div className="flex gap-1">
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
                  join(userId)
                }}
                disabled={!isConnected}
              >
                Join
              </Button>
            </div>
          </div>
        </TitledContainer>
      </div>
    </>
  );
};

export default ChallengeView;
