import { EditableInput } from '@/components/EditableInput';
import { User } from '@/types/User';
import { WaitingRoomPlayer } from './WaitingRoomPlayer';

type WaitingRoomTeamProps = {
  defaultName: string;
  players: User[];
};

export const WaitingRoomTeam = ({
  defaultName,
  players,
}: WaitingRoomTeamProps) => {
  function handleRemovePlayer(id: string) {
    console.log(id);
  }

  return (
    <div className="flex flex-col w-full items-center gap-5">
      <EditableInput
        defaultValue={defaultName}
        iconSize={20}
        className="text-2xl font-bold text-center"
      />
      <div className="flex flex-col gap-2">
        {players.map((player) => (
          <WaitingRoomPlayer
            user={player}
            onRemove={handleRemovePlayer}
          />
        ))}
      </div>
      <div>(QR code)</div>
    </div>
  );
};
