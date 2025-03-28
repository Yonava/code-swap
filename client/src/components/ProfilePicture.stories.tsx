import type { Meta, StoryObj } from '@storybook/react';
import { ProfilePicture } from './ProfilePicture';
import pfp from '@/assets/default-pfp.png';

const meta = {
  title: 'UI/ProfilePicture',
  component: ProfilePicture,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    src: {
      description: 'Location where the picture is stored',
    },
  },
} satisfies Meta<typeof ProfilePicture>;

export default meta;

type Story = StoryObj<typeof ProfilePicture>;

/**
 * Renders a user's profile picture. Used for the Waiting Room
 * (FilledPlayerSlot component).
 */
export const PictureAvailable: Story = {
  args: {
    src: pfp,
  },
};

/**
 * Renders a fallback when user's profile picture isn't available. Used for the
 * Waiting Room (FilledPlayerSlot component).
 */
export const Fallback: Story = {};
