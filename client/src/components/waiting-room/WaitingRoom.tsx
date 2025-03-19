import { Modal } from '@/components/Modal';
import { WaitingRoomTeam } from './WaitingRoomTeam';

export const WaitingRoom = () => {
  return (
    <Modal
      title="Waiting Room"
      isOpen
      disableClose
      hideHeader
      className="w-[80vw] sm:w-96 md:w-2xl flex flex-col md:flex-row gap-y-12"
    >
      <WaitingRoomTeam defaultName="Team 1"></WaitingRoomTeam>
      <WaitingRoomTeam defaultName="Team 2"></WaitingRoomTeam>
    </Modal>
  );
};
