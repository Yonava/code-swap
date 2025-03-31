import { type ReactNode, useMemo } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

export type TitledContainerProps = {
  /**
   * displayed above container, titling the body content
   */
  title: string;
  /**
   * containers body content
   */
  children: ReactNode;
  /**
   * a tailwind class describing the containers width
   */
  width?: string;
};

const CONTAINER_CLASSES = [
  'bg-surface-container',
  'h-full',
  'rounded-md',
  'overflow-hidden',
  'relative',
].join(' ');

const TITLE_CLASSES = [
  'bg-surface-bright',
  'text-on-surface',
  'px-2',
  'font-bold',
  'h-[30px]',
  'flex',
  'items-center',
].join(' ');

const CHILD_CLASSES = ['h-[calc(100%-30px)]', 'overflow-auto'].join(' ');

export const TitledContainer = ({
  title,
  children,
  width,
}: TitledContainerProps) => {
  const computedStyles = useMemo(() => ({ width }), [width]);

  return (
    <div
      className={CONTAINER_CLASSES}
      style={computedStyles}
    >
      <div className={TITLE_CLASSES}>
        <span>{title}</span>
      </div>
      <PerfectScrollbar>
        <div className={CHILD_CLASSES}>{children}</div>
      </PerfectScrollbar>
    </div>
  );
};
