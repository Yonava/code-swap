import { Button } from '@/components/ui/Button';
import { DialogBox } from '@/components/DialogBox';
import { WaitingRoomTeam } from './WaitingRoomTeam';
import { useContext } from 'react';
import MatchContext from '@/views/MatchContext';

type WaitingRoomProps = {
  startMatch: () => void,
  leaveMatch: () => void,
}

export const WaitingRoom = ({ startMatch, leaveMatch }: WaitingRoomProps) => {
  const { playerId, liveMatch: match } = useContext(MatchContext)

  if (!match) return null;
  const canStartMatch = match.hostId === playerId

  return (
    <DialogBox
      title="Waiting Room"
      isOpen
      disableClose
      hideHeader
    >
      <div className="flex flex-col gap-10 min-h-[500px] min-w-[80vw]">
        matchId: {match.id}
        <div className="grow flex flex-col md:flex-row gap-y-10 md:mt-8">
          <WaitingRoomTeam
            defaultName="Team 1"
            team={match.teams[0]}
          />
          <WaitingRoomTeam
            defaultName="Team 2"
            team={match.teams[1]}
          ></WaitingRoomTeam>
        </div>
        <Button
          onClick={startMatch}
          className="self-center w-32"
          disabled={!canStartMatch}
        >
          Start Match
        </Button>
        <Button
          onClick={leaveMatch}
          className="self-center w-32"
        >
          Leave Match
        </Button>
      </div>
    </DialogBox>
  );
};
