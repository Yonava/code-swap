import { cn } from '@/lib/utils';
import { ProfilePicture } from '@/components/ProfilePicture';
import { Player } from '@/types/Player';
import { X } from 'lucide-react';

type WaitingRoomPlayerProps = {
  player: Player;
  onRemove: (id: string) => void;
  className?: string;
};

export const WaitingRoomPlayer = ({
  player,
  onRemove,
  className,
}: WaitingRoomPlayerProps) => {
  return (
    <div className={cn('gap-5', className)}>
      <ProfilePicture src={player.pfp} />
      <div className="min-w-24">{player.name}</div>
      <button
        onClick={() => onRemove(player.id)}
        className="cursor-pointer"
      >
        <X size={22} />
      </button>
    </div>
  );
};
