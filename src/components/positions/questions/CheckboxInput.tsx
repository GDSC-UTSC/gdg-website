import { Label } from "@/components/ui/label";

interface CheckboxOption {
  value: string;
  label: string;
}

interface CheckboxInputProps {
  id: string;
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  options: CheckboxOption[];
  required?: boolean;
  className?: string;
}

export default function CheckboxInput({
  id,
  label,
  values,
  onChange,
  options,
  required = false,
  className = "",
}: CheckboxInputProps) {
  const handleCheckboxChange = (optionValue: string, checked: boolean) => {
    if (checked) {
      onChange([...values, optionValue]);
    } else {
      onChange(values.filter((value) => value !== optionValue));
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <Label className="text-lg font-medium">
        {label} {required && "*"}
      </Label>
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={`${id}-${option.value}`}
              checked={values.includes(option.value)}
              onChange={(e) => handleCheckboxChange(option.value, e.target.checked)}
              className="w-4 h-4 text-primary bg-background border-input rounded focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            <Label
              htmlFor={`${id}-${option.value}`}
              className="text-base font-normal cursor-pointer"
            >
              {option.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}