import type { Meta, StoryObj } from '@storybook/react';
import { WaitingRoomTeam } from './WaitingRoomTeam';

const meta = {
  title: 'UI/WaitingRoom/WaitingRoomTeam',
  component: WaitingRoomTeam,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    defaultName: {
      description: 'The default name given to the team',
    },
  },
} satisfies Meta<typeof WaitingRoomTeam>;

export default meta;

type Story = StoryObj<typeof WaitingRoomTeam>;

/**
 * How a team is represented in the Waiting Room. Consists of a configurable name,
 * avatars and names of each player, and a QR code to join the team.
 */
export const Default: Story = {
  args: {
    defaultName: 'Team Name',
  },
};
