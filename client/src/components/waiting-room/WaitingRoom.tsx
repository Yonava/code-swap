import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/Modal';
import { WaitingRoomTeam } from './WaitingRoomTeam';

export const WaitingRoom = () => {
  function startGame() {
    console.log('start!');
  }

  return (
    <Modal
      title="Waiting Room"
      isOpen
      disableClose
      hideHeader
      className="flex flex-col gap-10 w-[80vw] sm:w-96 md:w-2xl"
    >
      <div className="flex flex-col md:flex-row gap-y-12">
        <WaitingRoomTeam defaultName="Team 1"></WaitingRoomTeam>
        <WaitingRoomTeam defaultName="Team 2"></WaitingRoomTeam>
      </div>
      <Button
        onClick={startGame}
        className="self-center w-32"
      >
        Start Game
      </Button>
    </Modal>
  );
};
