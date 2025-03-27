import { useState } from 'react';

import { EditableText } from '@/components/EditableText';
import { EmptyPlayerSlot } from './PlayerSlot/EmptyPlayerSlot';
import { FilledPlayerSlot } from './PlayerSlot/FilledPlayerSlot';
import { PlayerSlot } from './PlayerSlot/PlayerSlot';
import { QRCode } from './QRCode';

import { generateCode } from '@/utils/generate-code';
import { MOCK_PLAYERS } from '@/mock-data/mock-players';
import { Player } from '@/types/Player';

type WaitingRoomTeamProps = {
  defaultName: string;
};

export const WaitingRoomTeam = ({ defaultName }: WaitingRoomTeamProps) => {
  const [player1, setPlayer1] = useState<Player>(MOCK_PLAYERS[0]);
  const [player2, setPlayer2] = useState<Player>(MOCK_PLAYERS[1]);
  const joinCode = generateCode();

  return (
    <div className="flex flex-col w-full items-center gap-5 md:gap-18">
      <EditableText
        defaultValue={defaultName}
        iconSize={18}
        className="text-2xl font-bold text-center"
      />
      <div className="grow flex flex-col justify-evenly mr-8">
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
      <QRCode joinCode={joinCode} />
    </div>
  );
};
