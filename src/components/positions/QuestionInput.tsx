import { QuestionType } from "@/app/types/positions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/ui/file-upload";
import { useState } from "react";

interface QuestionInputProps {
  question: QuestionType;
  value: any;
  onChange: (value: any) => void;
  index: number;
}

export default function QuestionInput({
  question,
  value,
  onChange,
  index,
}: QuestionInputProps) {
  const [files, setFiles] = useState<File[]>([]);

  const handleFilesChange = (newFiles: File[]) => {
    setFiles(newFiles);
    onChange(newFiles.length > 0 ? newFiles[0] : null);
  };

  const handleCheckboxChange = (option: string, checked: boolean) => {
    const currentValues = Array.isArray(value) ? value : [];
    if (checked) {
      onChange([...currentValues, option]);
    } else {
      onChange(currentValues.filter((v: string) => v !== option));
    }
  };

  const renderInput = () => {
    switch (question.type) {
      case "text":
        return (
          <Input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`Enter ${question.label.toLowerCase()}`}
            className="w-full"
          />
        );

      case "textarea":
        return (
          <Textarea
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`Enter ${question.label.toLowerCase()}`}
            className="w-full min-h-[120px]"
            rows={4}
          />
        );

      case "select":
        return (
          <Select value={value || ""} onValueChange={onChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={`Select ${question.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "checkbox":
        return (
          <div className="space-y-3">
            {question.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`${index}-${option}`}
                  checked={Array.isArray(value) ? value.includes(option) : false}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(option, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`${index}-${option}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {option}
                </Label>
              </div>
            ))}
          </div>
        );

      case "file":
        return (
          <FileUpload
            files={files}
            setFiles={handleFilesChange}
            accept=".pdf,.doc,.docx"
            maxSize={10}
            multiple={false}
            showPreview={false}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-base font-medium">
        {question.label}
        {question.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {renderInput()}
    </div>
  );
}
