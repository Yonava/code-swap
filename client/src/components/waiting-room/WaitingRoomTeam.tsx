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
        className="w-54 text-2xl font-bold text-center"
      />
      <div>
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
