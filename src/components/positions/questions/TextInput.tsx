import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TextInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export default function TextInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  className = "",
}: TextInputProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      <Label htmlFor={id} className="text-lg font-medium">
        {label} {required && "*"}
      </Label>
      <Input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="h-12 text-lg"
      />
    </div>
  );
}