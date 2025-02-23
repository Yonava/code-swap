import { type ReactNode, useMemo } from 'react';

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
  'bg-gray-800',
  'h-full',
  'rounded-md',
  'overflow-hidden',
  'relative',
].join(' ');

const TITLE_CLASSES = [
  'bg-gray-700',
  'px-2',
  'font-bold',
  'text-gray-200',
].join(' ');

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
      <div className={TITLE_CLASSES}>{title}</div>
      {children}
    </div>
  );
};
