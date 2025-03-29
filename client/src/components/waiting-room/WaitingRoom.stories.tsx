import type { Meta, StoryObj } from '@storybook/react';
import { WaitingRoom } from './WaitingRoom';

const meta = {
  title: 'UI/WaitingRoom',
  component: WaitingRoom,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof WaitingRoom>;

export default meta;

type Story = StoryObj<typeof WaitingRoom>;

/**
 * Where players wait for teams to assemble before starting a game.
 */
export const Default: Story = {};
