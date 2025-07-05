import { QuestionType } from "@/app/types/positions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X } from "lucide-react";
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onChange(file);
    }
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
          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <Label
                htmlFor={`file-${index}`}
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-border border-dashed rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/30 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF, DOC, DOCX files (Max 10MB)
                  </p>
                </div>
                <Input
                  id={`file-${index}`}
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                />
              </Label>
            </div>
            {selectedFile && (
              <Card className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                      <Upload className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedFile(null);
                      onChange(null);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            )}
          </div>
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
