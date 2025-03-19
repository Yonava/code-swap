import { MOCK_USERS } from '@/mock-data/mock-users';
import { Modal } from '@/components/Modal';
import { WaitingRoomTeam } from './WaitingRoomTeam';

export const WaitingRoom = () => {
  return (
    <Modal
      title="Waiting Room"
      isOpen
      disableClose
      hideHeader
      className="flex flex-col md:flex-row gap-10"
    >
      <WaitingRoomTeam
        defaultName="Team 1"
        players={[MOCK_USERS[0], MOCK_USERS[1]]}
      ></WaitingRoomTeam>
      <WaitingRoomTeam
        defaultName="Team 2"
        players={[MOCK_USERS[2], MOCK_USERS[3]]}
      ></WaitingRoomTeam>
    </Modal>
  );
};
