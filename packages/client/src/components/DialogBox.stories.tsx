import type { Meta, StoryObj } from '@storybook/react';
import { DialogBox } from './DialogBox';

const meta = {
  title: 'UI/DialogBox',
  component: DialogBox,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    title: {
      description: 'Dialog title',
    },
    children: {
      description: 'Dialog body content',
    },
    trigger: {
      description: 'Element that is clicked to open the dialog',
    },
    subtitle: {
      description: 'Dialog subtitle',
    },
    footer: {
      description: 'Dialog footer content',
    },
    isOpen: {
      description: 'Automatically open the dialog',
    },
    disableClose: {
      description: 'Do not allow the user to close the dialog',
    },
    hideHeader: {
      description: 'Hide the title and subtitle',
    },
  },
} satisfies Meta<typeof DialogBox>;

export default meta;

type Story = StoryObj<typeof DialogBox>;

/**
 * Dialog with an optional trigger, subtitle, and footer; as well as options to
 * start up open, disable being closed by the user, and hide the title and
 * subtitle. Used for the Waiting Room.
 */
export const Default: Story = {
  args: {
    title: 'Dialog title',
    children: <p>Dialog content</p>,
    trigger: <button>Click to open</button>,
    subtitle: 'Dialog subtitle',
    footer: <p>Dialog footer</p>,
  },
};
