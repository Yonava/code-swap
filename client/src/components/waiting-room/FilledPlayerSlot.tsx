import { cn } from '@/lib/utils';
import { ProfilePicture } from '@/components/ProfilePicture';
import type { Player } from 'shared-types/dist/match-making';
import { useContext } from 'react';
import MatchContext from '@/views/MatchContext';

type FilledPlayerSlotProps = {
  player: Player;
  className?: string;
};

export const FilledPlayerSlot = ({
  player,
  className,
}: FilledPlayerSlotProps) => {
  const { playerId } = useContext(MatchContext)
  return (
    <div className={cn('flex items-center gap-4', className)}>
      <ProfilePicture src={player.avatar} />
      <span>{player.id} {playerId === player.id && '(Me!)'}</span>
    </div>
  );
};
