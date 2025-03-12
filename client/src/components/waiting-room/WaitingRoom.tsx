import { Modal } from '@/components/modal/Modal';
import { ModalHeader } from '@/components/modal/ModalHeader';
import { WaitingRoomTeam } from './WaitingRoomTeam';

export const WaitingRoom = () => {
  const header = (
    <ModalHeader
      hidden
      title="Waiting Room"
    ></ModalHeader>
  );

  return (
    <Modal
      isOpen
      disableClose
      header={header}
      className="flex flex-col md:flex-row gap-3 bg-gray-200 p-3"
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
