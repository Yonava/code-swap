import { cn } from '@/lib/utils';
import { useState } from 'react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type DialogBoxProps = {
  title: string;
  children: React.ReactNode;
  trigger?: React.ReactNode;
  subtitle?: string;
  footer?: React.ReactNode;
  isOpen?: boolean;
  disableClose?: boolean;
  hideHeader?: boolean;
};

export const DialogBox = ({
  title,
  children,
  trigger,
  subtitle,
  footer,
  isOpen = false,
  disableClose = false,
  hideHeader = false,
  ...props
}: DialogBoxProps) => {
  const [open, setOpen] = useState(isOpen);

  const handleClose = (e) => {
    if (disableClose) {
      e.preventDefault();
    }
  };

  const HeaderContent = (
    <DialogHeader>
      <DialogTitle>{title}</DialogTitle>
      <DialogDescription>{subtitle}</DialogDescription>
    </DialogHeader>
  );

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      {trigger && <DialogTrigger>{trigger}</DialogTrigger>}
      <DialogContent
        onInteractOutside={handleClose}
        onEscapeKeyDown={handleClose}
        className={cn('!max-w-fit', { '[&>button]:hidden': disableClose })}
      >
        {hideHeader ? (
          <VisuallyHidden>{HeaderContent}</VisuallyHidden>
        ) : (
          HeaderContent
        )}
        <div {...props}>{children}</div>
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
};
