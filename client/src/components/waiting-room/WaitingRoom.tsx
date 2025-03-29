import { useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { DialogBox } from '@/components/DialogBox';
import { WaitingRoomTeam } from './WaitingRoomTeam';

export const WaitingRoom = () => {
  const dialogRef = useRef({ closeDialog: () => {} });

  function startGame() {
    dialogRef.current.closeDialog();
  }

  return (
    <DialogBox
      title="Waiting Room"
      ref={dialogRef}
      isOpen
      disableClose
      hideHeader
      className="flex flex-col gap-10 min-h-[500px] min-w-[80vw]"
    >
      <div className="grow flex flex-col md:flex-row gap-y-10 md:mt-8">
        <WaitingRoomTeam defaultName="Team 1"></WaitingRoomTeam>
        <WaitingRoomTeam defaultName="Team 2"></WaitingRoomTeam>
      </div>
      <Button
        onClick={startGame}
        className="self-center w-fit"
      >
        Start Game
      </Button>
    </DialogBox>
  );
};
