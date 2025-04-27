import type { Meta, StoryObj } from '@storybook/react';
import { EmptyPlayerSlot } from './EmptyPlayerSlot';
import { PlayerSlot } from './PlayerSlot';

const meta = {
  title: 'UI/PlayerSlot/EmptyPlayerSlot',
  component: EmptyPlayerSlot,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof EmptyPlayerSlot>;

export default meta;

type Story = StoryObj<typeof EmptyPlayerSlot>;

/**
 * How an available slot in a team is represented in the Waiting Room.
 */
export const Default: Story = {
  render: () => (
    <PlayerSlot>
      <EmptyPlayerSlot />
    </PlayerSlot>
  ),
};
