import { cn } from '@/lib/utils';
import { ProfilePicture } from '@/components/ProfilePicture';
import { Player } from 'shared-types/dist/match-making';

type FilledPlayerSlotProps = {
  player: Player;
  className?: string;
};

export const FilledPlayerSlot = ({
  player,
  className,
}: FilledPlayerSlotProps) => {
  return (
    <div className={cn('flex items-center gap-4', className)}>
      <ProfilePicture src={player.avatar} />
      <span>{player.id} {player.name}</span>
    </div>
  );
};
