import { ProfilePicture } from '@/components/ProfilePicture';
import { User } from '@/types/User';
import { X } from 'lucide-react';

type WaitingRoomPlayerProps = {
  user: User;
  onRemove: (id: string) => void;
};

export const WaitingRoomPlayer = ({
  user,
  onRemove,
}: WaitingRoomPlayerProps) => {
  return (
    <div className="flex items-center gap-4">
      <ProfilePicture src={user.pfp} />
      {user.name}
      <button
        onClick={() => onRemove(user.id)}
        className="cursor-pointer"
      >
        <X size={18} />
      </button>
    </div>
  );
};
