import { EditableInput } from '@/components/EditableInput';
import { MOCK_PLAYERS } from '@/mock-data/mock-players';
import { Player } from '@/types/Player';
import { useState } from 'react';
import { WaitingRoomPlayer } from './WaitingRoomPlayer';

type WaitingRoomTeamProps = {
  defaultName: string;
};

export const WaitingRoomTeam = ({ defaultName }: WaitingRoomTeamProps) => {
  const [players, setPlayers] = useState<Player[]>([]);

  function removePlayer(id: string) {
    // setPlayers((players) =>
    //   players.map((p) => (p.id === id ? { id: p.id } : p))
    // );
  }

  return (
    <div className="flex flex-col w-full items-center gap-5">
      <EditableInput
        defaultValue={defaultName}
        iconSize={18}
        className="text-2xl font-bold text-center"
      />
      <div className="flex flex-col items-center gap-2">
        {players.map((player) => (
          <WaitingRoomPlayer
            key={player.id}
            player={player}
            onRemove={removePlayer}
          />
        ))}
      </div>
      <div>(QR code)</div>
    </div>
  );
};
