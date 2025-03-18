import React from 'react';

type WaitingRoomPlayerProps = {
  children: React.ReactNode;
};

export const WaitingRoomPlayer = ({ children }: WaitingRoomPlayerProps) => {
  return <div>{children}</div>;
};
