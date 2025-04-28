import { Button } from '@/components/ui/button';
import { WaitingRoomTeam } from './WaitingRoomTeam';
import { useNavigate } from 'react-router';
import { useMatchContext } from '@/state/match/useMatchContext';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';

export const WaitingRoom = () => {
  const { playerId, match, matchPhase, leaveMatch, matchReady } = useMatchContext()
  const navigate = useNavigate()

  if (!match) return null;

  const isHost = match.hostId === playerId
  const allPlayerSlotsFilled = match.teams.flat().every(Boolean)
  const canStartMatch = isHost && allPlayerSlotsFilled;

  const fillRoom = () => {
    window.open(`http://localhost:5173/challenge?matchId=${match.id}-0`)
    window.open(`http://localhost:5173/challenge?matchId=${match.id}-1`)
    window.open(`http://localhost:5173/challenge?matchId=${match.id}-1`)
  }

  return (
    <Dialog open={matchPhase === 'matchMaking'}>
      <DialogContent className="flex flex-col gap-10 min-h-[500px] min-w-[80vw] [&>button]:hidden">
        playerId: {playerId}, matchId: {match.id}, isHost: {isHost ? 'yes' : 'no'}
        <DialogTitle>
          Match Starting Soon!
        </DialogTitle>
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
          <Button
            onClick={fillRoom}
          >
            Fill Room (Dev Only)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
