import { ProfilePicture } from '@/components/ProfilePicture';
import { Player } from '@/types/Player';
import { X } from 'lucide-react';

type WaitingRoomPlayerProps = {
  player: Player;
  onRemove: (id: string) => void;
};

export const WaitingRoomPlayer = ({
  player,
  onRemove,
}: WaitingRoomPlayerProps) => {
  return (
    <div className="flex items-center gap-5">
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
