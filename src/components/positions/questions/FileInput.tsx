import { Label } from "@/components/ui/label";

interface FileInputProps {
  id: string;
  label: string;
  onChange: (file: File | null) => void;
  accept?: string;
  required?: boolean;
  className?: string;
}

export default function FileInput({
  id,
  label,
  onChange,
  accept,
  required = false,
  className = "",
}: FileInputProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange(file);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <Label htmlFor={id} className="text-lg font-medium">
        {label} {required && "*"}
      </Label>
      <input
        type="file"
        id={id}
        onChange={handleFileChange}
        accept={accept}
        required={required}
        className="w-full px-4 py-3 border border-input bg-background rounded-md text-base file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      />
    </div>
  );
}