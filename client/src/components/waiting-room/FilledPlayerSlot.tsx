import { cn } from '@/lib/utils';
import { ProfilePicture } from '@/components/ProfilePicture';
import { Player } from '@/types/Player';

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
      <ProfilePicture src={player.pfp} />
      <span>{player.name}</span>
    </div>
  );
};
