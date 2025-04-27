type PlayerSlotProps = {
  children: React.ReactNode;
};

export const PlayerSlot = ({ children }: PlayerSlotProps) => {
  return (
    <div className="h-10 flex justify-center items-center">{children}</div>
  );
};
