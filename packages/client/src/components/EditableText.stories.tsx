import type { Meta, StoryObj } from '@storybook/react';
import { EditableText } from './EditableText';

const meta = {
  title: 'UI/EditableText',
  component: EditableText,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    defaultValue: {
      description: 'The default text value',
    },
    iconSize: {
      description: 'The size of the "edit" button',
    },
    className: {
      description: 'Additional Tailwind classes applied to the component',
    },
  },
} satisfies Meta<typeof EditableText>;

export default meta;

type Story = StoryObj<typeof EditableText>;

/**
 * Text with an "edit" button which, when clicked, turns the text into an input
 * field. Used for the Waiting Room (WaitingRoomTeam component).
 */
export const Default: Story = {
  args: {
    defaultValue: 'My editable text',
    iconSize: 18,
  },
};
