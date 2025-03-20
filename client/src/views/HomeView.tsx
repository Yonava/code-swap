import { Button } from '@/components/ui/Button';
import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type BillboardProps = {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
  right?: boolean;
};

const Billboard = ({
  title,
  description,
  className,
  actions,
  right = false,
}: BillboardProps) => {
  const RIGHT_CLASSES = 'justify-end text-right';
  const DEFAULT_CLASSES =
    'w-full h-[600px] flex items-center p-[100px] ' +
    (right ? RIGHT_CLASSES : '');
  return (
    <div className={twMerge(DEFAULT_CLASSES, className)}>
      <div className="flex flex-col gap-8">
        <h1 className="text-8xl font-bold">{title}</h1>
        <h2 className="text-3xl">{description}</h2>
        <div className="flex gap-2">{actions}</div>
      </div>
    </div>
  );
};

const StartActions = () => (
  <>
    <Button>Host</Button>
    <Button variant="secondary">Join</Button>
  </>
);

const HomeView = () => {
  return (
    <div>
      <Billboard
        title="Code Swap"
        description="The most entertaining way to learn the fundamentals of collaborative coding"
        actions={<StartActions />}
        className="bg-gray-700 text-gray-50 h-[100vh]"
      />

      <Billboard
        title="Be Competitive"
        description="go head to head against your friends"
        className="bg-blue-600 text-gray-50"
        right
      />

      <Billboard
        title="Be Creative"
        description="develop unique solutions to interesting problems"
      />

      <Billboard
        title="Be Ready"
        description="code editors switch every 60 seconds"
        className="bg-blue-600 text-gray-50"
        right
      />

      <Billboard
        title="Let's Start"
        description="are you hosting or joining a session?"
        className="bg-gray-700 text-gray-50"
        actions={<StartActions />}
      />
    </div>
  );
};

export default HomeView;
