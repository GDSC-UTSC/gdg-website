import { Label } from "@/components/ui/label";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export default function SelectInput({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
  required = false,
  className = "",
}: SelectInputProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      <Label htmlFor={id} className="text-lg font-medium">
        {label} {required && "*"}
      </Label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full px-4 py-3 border border-input bg-background rounded-md text-base focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}