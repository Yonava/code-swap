import { WaitingRoomPlayer } from './WaitingRoomPlayer';

type Props = {
  name: string;
  members: string[];
};

export const WaitingRoomTeam = ({ name, members }: Props) => {
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
