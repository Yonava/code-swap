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

type Props = {
  title: string;
  children: React.ReactNode;
  trigger?: React.ReactNode;
  subtitle?: string;
  footer?: React.ReactNode;
  isOpen?: boolean;
  disableClose?: boolean;
  hideHeader?: boolean;
};

export const Modal = ({
  title,
  children,
  trigger,
  subtitle,
  footer,
  isOpen = false,
  disableClose = false,
  hideHeader = false,
  ...props
}: Props) => {
  const [open, setOpen] = useState(isOpen);

  const handleInteractOutside = (e) => {
    if (disableClose) e.preventDefault();
  };

  const header = (
    <DialogHeader>
      <DialogTitle>{title}</DialogTitle>
      {subtitle && <DialogDescription>{subtitle}</DialogDescription>}
    </DialogHeader>
  );

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      {trigger && <DialogTrigger>{trigger}</DialogTrigger>}
      <DialogContent
        onInteractOutside={handleInteractOutside}
        className={cn({ '[&>button]:hidden': disableClose })}
      >
        {!hideHeader && header}
        {hideHeader && <VisuallyHidden>{header}</VisuallyHidden>}
        <div {...props}>{children}</div>
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
};
