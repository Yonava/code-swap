import { WaitingRoomPlayer } from './WaitingRoomPlayer';

type WaitingRoomTeamProps = {
  name: string;
  members: string[];
};

export const WaitingRoomTeam = ({ name, members }: WaitingRoomTeamProps) => {
  return (
    <div className="flex flex-col w-full items-center">
      <h1 className="text-2xl font-bold">{name}</h1>
      <div>
        {members.map((e) => (
          <WaitingRoomPlayer>{e}</WaitingRoomPlayer>
        ))}
      </div>
      <div>QR code</div>
    </div>
  );
};
