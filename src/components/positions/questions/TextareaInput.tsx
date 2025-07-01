import { Label } from "@/components/ui/label";

interface TextareaInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  className?: string;
}

export default function TextareaInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  rows = 8,
  className = "",
}: TextareaInputProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      <Label htmlFor={id} className="text-lg font-medium">
        {label} {required && "*"}
      </Label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className="w-full px-4 py-3 border border-input bg-background rounded-md text-base resize-vertical focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      />
    </div>
  );
}