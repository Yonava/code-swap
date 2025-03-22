export type DisplayInputProps = {
  title: string;
  value: string;
};

export function DisplayInput({ title, value }: DisplayInputProps) {
  return (
    <>
      <p className="font-bold">{title}</p>
      <input
        className="w-full p-2 mb-2 border border-gray-300 rounded"
        value={value}
        readOnly
      />
    </>
  );
}
