import { cn } from '@/lib/utils';
import { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';

import { ModalHeader } from './ModalHeader';

type Props = {
  header: React.ReactElement<typeof ModalHeader>;
  children: React.ReactNode;
  trigger?: React.ReactNode;
  footer?: React.ReactNode;
  isOpen?: boolean;
  disableClose?: boolean;
};

export const Modal = ({
  header,
  children,
  trigger,
  footer,
  isOpen = false,
  disableClose = false,
  ...props
}: Props) => {
  const [open, setOpen] = useState(isOpen);

  const handleInteractOutside = (e) => {
    if (disableClose) e.preventDefault();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      {trigger && <DialogTrigger>{trigger}</DialogTrigger>}
      <DialogContent
        onInteractOutside={handleInteractOutside}
        className={cn('p-0 rounded', { '[&>button]:hidden': disableClose })}
      >
        {header}
        <div {...props}>{children}</div>
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
};
