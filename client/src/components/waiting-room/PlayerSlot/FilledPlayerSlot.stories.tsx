import type { Meta, StoryObj } from '@storybook/react';
import { FilledPlayerSlot } from './FilledPlayerSlot';
import { PlayerSlot } from './PlayerSlot';
import pfp from '@/assets/default-pfp.png';

const meta = {
  title: 'UI/WaitingRoom/PlayerSlot/FilledPlayerSlot',
  component: FilledPlayerSlot,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    player: {
      description: 'The player represented by the component',
    },
    className: {
      description: 'Additional Tailwind classes applied to the component',
    },
  },
} satisfies Meta<typeof FilledPlayerSlot>;

export default meta;

type Story = StoryObj<typeof FilledPlayerSlot>;

/**
 * How a player is represented in the Waiting Room.
 */
export const Default: Story = {
  args: {
    player: {
      id: '1',
      name: 'Player Name',
      pfp,
    },
  },
  render: (args) => (
    <PlayerSlot>
      <FilledPlayerSlot {...args} />
    </PlayerSlot>
  ),
};
