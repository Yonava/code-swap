import { Modal } from '@/components/Modal';
import { WaitingRoomTeam } from './WaitingRoomTeam';

export const WaitingRoom = () => {
  return (
    <Modal
      title="Waiting Room"
      isOpen
      disableClose
      hideHeader
      className="flex flex-col md:flex-row gap-3"
    >
      <WaitingRoomTeam
        name="team 1"
        members={['ashley', 'yona']}
      ></WaitingRoomTeam>
      <WaitingRoomTeam
        name="team 2"
        members={['viral', 'wanqi']}
      ></WaitingRoomTeam>
    </Modal>
  );
};
