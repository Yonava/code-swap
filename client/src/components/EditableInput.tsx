import { useEffect, useRef, useState } from 'react';
import { Check, Pencil } from 'lucide-react';

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

  function handleInputChange(e) {
    setValue(e.target.value);
  }

  // toggle editing on button click
  function handleButtonClick() {
    setIsEditing((prev) => !prev);
  }

  // stop editing on blur
  function handleBlur(e) {
    if (inputRef.current?.contains(e.target)) setIsEditing(false);
  }

  // stop editing on ENTER or ESC
  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === 'Escape') setIsEditing(false);
  }

  // focus input if editing
  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  return (
    <div
      onBlur={handleBlur}
      className="flex items-center gap-2"
    >
      <input
        value={value}
        ref={inputRef}
        disabled={!isEditing}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className={className}
      ></input>
      <button
        onClick={handleButtonClick}
        className="cursor-pointer"
      >
        {!isEditing && <Pencil size={iconSize} />}
        {isEditing && <Check size={iconSize} />}
      </button>
    </div>
  );
};
