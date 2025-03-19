import { EditableInput } from '@/components/EditableInput';
import { MOCK_PLAYERS } from '@/mock-data/mock-players';
import { WaitingRoomPlayer } from './WaitingRoomPlayer';
import { useState } from 'react';

type WaitingRoomTeamProps = {
  defaultName: string;
};

export const WaitingRoomTeam = ({ defaultName }: WaitingRoomTeamProps) => {
  const [players, setPlayers] = useState([MOCK_PLAYERS[0], MOCK_PLAYERS[1]]);
  const emptySlots = [];
  const slotClasses = 'h-10 flex items-center';

  for (let i = 0; i < 2 - players.length; ++i) emptySlots.push(null);

  return (
    <div className="flex flex-col w-full items-center gap-6">
      <EditableInput
        defaultValue={defaultName}
        iconSize={18}
        className="text-2xl font-bold text-center"
      />
      <div className="flex flex-col">
        {players.map((player) => (
          <WaitingRoomPlayer
            key={player.id}
            player={player}
            className={slotClasses}
          />
        ))}
        {emptySlots.map((_, i) => (
          <div
            key={i}
            className={slotClasses}
          >
            empty
          </div>
        ))}
      </div>
      <div>(QR code)</div>
    </div>
  );
};
