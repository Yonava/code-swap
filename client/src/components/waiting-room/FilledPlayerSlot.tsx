import { cn } from '@/lib/utils';
import { ProfilePicture } from '@/components/ProfilePicture';
import type { Player } from 'shared-types/dist/match-making';
import { useMatchContext } from '@/state/match/useMatchContext';

type FilledPlayerSlotProps = {
  player: Player;
  className?: string;
};

export const FilledPlayerSlot = ({
  player,
  className,
}: FilledPlayerSlotProps) => {
  const { playerId } = useMatchContext()
  return (
    <div className={cn('flex items-center gap-4', className)}>
      <ProfilePicture src={player.avatar} />
      <span>{player.id} {playerId === player.id && '(Me!)'}</span>
    </div>
  );
};
