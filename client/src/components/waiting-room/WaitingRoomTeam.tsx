import { useState } from 'react';

import { EditableText } from '@/components/EditableText';
import { EmptyPlayerSlot } from './EmptyPlayerSlot';
import { FilledPlayerSlot } from './FilledPlayerSlot';
import { PlayerSlot } from './PlayerSlot';

import { MOCK_PLAYERS } from '@/mock-data/mock-players';
import { Player } from '@/types/Player';

type WaitingRoomTeamProps = {
  defaultName: string;
};

export const WaitingRoomTeam = ({ defaultName }: WaitingRoomTeamProps) => {
  const [player1, setPlayer1] = useState<Player>(MOCK_PLAYERS[0]);
  const [player2, setPlayer2] = useState<Player>(MOCK_PLAYERS[1]);

  return (
    <div className="flex flex-col w-full items-center gap-6">
      <EditableText
        defaultValue={defaultName}
        iconSize={18}
        className="text-2xl font-bold text-center ml-8"
      />
      <div className="flex flex-col">
        <PlayerSlot>
          {player1 ? (
            <FilledPlayerSlot
              key={player1.id}
              player={player1}
            />
          ) : (
            <EmptyPlayerSlot />
          )}
        </PlayerSlot>
        <PlayerSlot>
          {player2 ? (
            <FilledPlayerSlot
              key={player2.id}
              player={player2}
            />
          ) : (
            <EmptyPlayerSlot />
          )}
        </PlayerSlot>
      </div>
      <div>(QR code)</div>
    </div>
  );
};
