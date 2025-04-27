import { EditableText } from '@/components/EditableText';
import { EmptyPlayerSlot } from './EmptyPlayerSlot';
import { FilledPlayerSlot } from './FilledPlayerSlot';
import { PlayerSlot } from './PlayerSlot';
import type { Match } from 'shared-types/dist/match-making';

type WaitingRoomTeamProps = {
  defaultName: string;
  team: Match['teams'][number]
};

export const WaitingRoomTeam = ({ defaultName, team }: WaitingRoomTeamProps) => {
  const [player1, player2] = team

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
      <div className="border border-black size-22 md:size-32">(QR code)</div>
    </div>
  );
};
