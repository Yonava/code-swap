import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    children: {
      description: 'Button label',
    },
    variant: {
      control: 'radio',
      options: ['', 'secondary', 'outline', 'destructive', 'ghost', 'link'],
      description:
        'Variants of how the button appears (do not specify for primary)',
    },
    asChild: {
      description: 'Delegates rendering the child element',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof Button>;

/** Default button provided by shadcn. */
export const Default: Story = {
  args: {
    children: 'Default',
    variant: 'default',
  },
};

/** Secondary button provided by shadcn. */
export const Secondary: Story = {
  args: {
    children: 'Secondary',
    variant: 'secondary',
  },
};

/** Outlined button provided by shadcn. */
export const Outline: Story = {
  args: {
    children: 'Outline',
    variant: 'outline',
  },
};
