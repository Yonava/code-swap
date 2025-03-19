import { cn } from '@/lib/utils';
import { ProfilePicture } from '@/components/ProfilePicture';
import { Player } from '@/types/Player';

type WaitingRoomPlayerProps = {
  player: Player;
  className?: string;
};

export const WaitingRoomPlayer = ({
  player,
  className,
}: WaitingRoomPlayerProps) => {
  return (
    <div className={cn('gap-5', className)}>
      <ProfilePicture src={player.pfp} />
      <span>{player.name}</span>
    </div>
  );
};
