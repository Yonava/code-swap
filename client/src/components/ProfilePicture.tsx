import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type ProfilePictureProps = {
  src: string;
};
export const ProfilePicture = ({ src }: ProfilePictureProps) => {
  return (
    <Avatar>
      <AvatarImage src={src} />
      <AvatarFallback>
        <span className="text-xs">&lt;/&gt;</span>
      </AvatarFallback>
    </Avatar>
  );
};
