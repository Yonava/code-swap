import { Button } from '@/components/ui/Button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { OTPInput } from 'input-otp';
import { ReactNode } from 'react';
import { useNavigate } from 'react-router';
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

const JoinAction = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Join</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join A Game 🤙</DialogTitle>
          <DialogDescription>
            Enter a team code (each game has two codes, one for each team)
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <InputOTP maxLength={4}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const StartActions = () => {
  return (
    <>
      <Button>Host</Button>
      <JoinAction />
    </>
  )
};

const HomeView = () => {
  const navigate = useNavigate();

  const StartActions = () => (
    <>
      <Button
        onClick={() => navigate('challenge')}
        className="text-on-surface bg-surface hover:bg-surface/80"
      >
        Host
      </Button>
      <Button className="text-surface bg-on-surface hover:bg-on-surface/80">
        Join
      </Button>
    </>
  );

  return (
    <div>
      <Billboard
        title="Code Swap"
        description="The most entertaining way to learn the fundamentals of collaborative coding"
        actions={<StartActions />}
        className="bg-primary text-on-primary h-[100vh]"
      />

      <Billboard
        title="Be Competitive"
        description="go head to head against your friends"
        right
      />

      <Billboard
        title="Be Creative"
        description="develop unique solutions to interesting problems"
        className="bg-tertiary text-on-tertiary"
      />

      <Billboard
        title="Be Ready"
        description="code editors switch every 60 seconds"
        right
      />

      <Billboard
        title="Let's Start"
        description="are you hosting or joining a session?"
        className="bg-primary text-on-primary h-[100vh]"
        actions={<StartActions />}
      />
    </div>
  );
};

export default HomeView;
