import { cn } from '@/lib/utils';
import { useImperativeHandle, useState } from 'react';
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

/**
 * @typedef {Object} DialogBoxProps
 * @property {string} title - Dialog title
 * @property {React.ReactNode} children - Dialog content
 * @property {React.ReactNode} [trigger] - Element that's clicked to open the dialog
 * @property {string} [subtitle] - Dialog subtitle
 * @property {React.ReactNode} [footer] - Dialog footer content
 * @property {React.RefObject<{ closeDialog: () => void }>} [ref] - Used to close dialog from parent
 * @property {boolean} [isOpen=false] - Whether the dialog starts open or closed
 * @property {boolean} [disableClose=false] - Whether the user is allowed to close the dialog
 * @property {boolean} [hideHeader=false] - Whether to show the title and subtitle
 */
type DialogBoxProps = {
  title: string;
  children: React.ReactNode;
  trigger?: React.ReactNode;
  subtitle?: string;
  footer?: React.ReactNode;
  ref?: React.RefObject<{ closeDialog: () => void }>;
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
  ref,
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

  useImperativeHandle(ref, () => ({
    closeDialog() {
      setOpen(false);
    },
  }));

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
