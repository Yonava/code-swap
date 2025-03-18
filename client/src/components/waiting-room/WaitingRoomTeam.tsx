import { EditableInput } from '@/components/EditableInput';
import { WaitingRoomPlayer } from './WaitingRoomPlayer';

type WaitingRoomTeamProps = {
  name: string;
  members: string[];
};

export const WaitingRoomTeam = ({ name, members }: WaitingRoomTeamProps) => {
  return (
    <div className="flex flex-col w-full items-center">
      <EditableInput
        defaultValue={name}
        className="w-54 text-2xl font-bold text-center"
      />
      <div>
        {members.map((e) => (
          <WaitingRoomPlayer>{e}</WaitingRoomPlayer>
        ))}
      </div>
      <div>QR code</div>
    </div>
  );
};
