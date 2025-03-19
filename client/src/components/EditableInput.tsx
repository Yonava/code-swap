import { cn } from '@/lib/utils';
import { Pencil } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type EditableInputProps = {
  defaultValue: string;
  iconSize?: number;
  className?: string;
};

export const EditableInput = ({
  defaultValue,
  iconSize = 24,
  className,
}: EditableInputProps) => {
  const [value, setValue] = useState(defaultValue);
  const [isEditing, setIsEditing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const lastValidInput = useRef(defaultValue);

  function stopEditing(saveChanges = true) {
    setIsEditing(false);

    // if empty string, replace value with last valid input
    if (saveChanges && value.trim().length > 0) lastValidInput.current = value;
    else setValue(lastValidInput.current);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === 'Tab') stopEditing();
    else if (e.key === 'Escape') stopEditing(false);
  }

  // focus on input while editing
  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  return (
    <>
      {isEditing && (
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => stopEditing()}
          onKeyDown={handleKeyDown}
          className={cn('w-full', className)}
        ></input>
      )}
      {!isEditing && (
        <div className="flex flex-row items-center gap-3">
          <span className={className}>{value}</span>
          <button
            onClick={() => setIsEditing(true)}
            className="cursor-pointer"
          >
            <Pencil size={iconSize} />
          </button>
        </div>
      )}
    </>
  );
};
