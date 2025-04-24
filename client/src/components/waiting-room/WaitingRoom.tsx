import { Button } from '@/components/ui/button';
import { DialogBox } from '@/components/DialogBox';
import { WaitingRoomTeam } from './WaitingRoomTeam';
import { useNavigate } from 'react-router';
import { useMatchContext } from '@/state/match/useMatchContext';

export const WaitingRoom = () => {
  const { playerId, match, leaveMatch, matchReady } = useMatchContext()
  const navigate = useNavigate()

  if (!match) return null;

  const isHost = match.hostId === playerId
  const allPlayerSlotsFilled = match.teams.flat().every(Boolean)
  const canStartMatch = isHost && allPlayerSlotsFilled

  return (
    <DialogBox
      title="Waiting Room"
      isOpen
      disableClose
      hideHeader
    >
      <div className="flex flex-col gap-10 min-h-[500px] min-w-[80vw]">
        playerId: {playerId}, matchId: {match.id}, isHost: {isHost ? 'yes' : 'no'}
        <div className="grow flex flex-col md:flex-row gap-y-10 md:mt-8">
          <WaitingRoomTeam
            defaultName={`Team 1 (${match.id}-0)`}
            team={match.teams[0]}
          />
          <WaitingRoomTeam
            defaultName={`Team 2 (${match.id}-1)`}
            team={match.teams[1]}
          ></WaitingRoomTeam>
        </div>
        <div className='flex gap-1 justify-center'>
          {isHost && <Button
            onClick={matchReady}
            className="self-center w-32 bg-green-600"
            disabled={!canStartMatch}
          >
            Start Match
          </Button>}
          <Button
            onClick={() => {
              leaveMatch()
              navigate('/')
            }}
            className="self-center w-32 bg-red-600"
          >
            Leave Match
          </Button>
        </div>
      </div>
    </DialogBox>
  );
};
