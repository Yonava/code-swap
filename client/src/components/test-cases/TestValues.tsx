import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export type DisplayInputProps = {
  title: string;
  value: string;
};

export function TestValues({ title, value }: DisplayInputProps) {
  return (
    <div className="grid w-full items-center">
      <Label className="text-lg font-bold">{title}</Label>
      <Input
        className="font-bold"
        value={value}
        readOnly
      />
    </div>
  );
}
