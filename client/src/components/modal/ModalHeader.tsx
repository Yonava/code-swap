import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type Props = {
  title: string;
  subtitle?: string;
  hidden?: boolean;
};

export const ModalHeader = ({ title, subtitle, hidden = false }: Props) => {
  const header = (
    <DialogHeader>
      <DialogTitle>{title}</DialogTitle>
      <DialogDescription>{subtitle}</DialogDescription>
    </DialogHeader>
  );

  return (
    <>
      {!hidden && header}
      {hidden && <VisuallyHidden>{header}</VisuallyHidden>}
    </>
  );
};
