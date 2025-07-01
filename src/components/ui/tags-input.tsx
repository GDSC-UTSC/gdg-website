import { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TagsInputProps {
  id: string;
  label: string;
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
}

export default function TagsInput({
  id,
  label,
  value,
  onChange,
  placeholder = "Type and press Enter to add...",
  className = "",
}: TagsInputProps) {
  const [inputValue, setInputValue] = useState("");

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !value.includes(trimmedTag)) {
      onChange([...value, trimmedTag]);
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      e.preventDefault();
      removeTag(value[value.length - 1]);
    }
  };

  const handleInputBlur = () => {
    if (inputValue.trim()) {
      addTag(inputValue);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <Label htmlFor={id} className="text-lg font-medium text-foreground">
        {label}
      </Label>
      <div className="min-h-[60px] p-4 border border-border rounded-lg bg-background/50 backdrop-blur-sm transition-all duration-200 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50 focus-within:bg-background/80 shadow-sm hover:shadow-md">
        <div className="flex flex-wrap gap-2 mb-3">
          {value.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground text-sm font-medium rounded-full shadow-sm hover:shadow-md transition-all duration-200 animate-in fade-in-0 zoom-in-95"
            >
              <span className="truncate max-w-[120px]">{tag}</span>
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:bg-white/20 rounded-full p-1 transition-colors duration-150 group"
                aria-label={`Remove ${tag}`}
              >
                <X size={14} className="text-primary-foreground/80 group-hover:text-primary-foreground transition-colors" />
              </button>
            </span>
          ))}
        </div>
        <Input
          id={id}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleInputBlur}
          placeholder={value.length === 0 ? placeholder : "Add another option..."}
          className="border-0 p-0 h-auto text-base placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
        />
      </div>
      {value.length > 0 && (
        <p className="text-xs text-muted-foreground/70 mt-2">
          Press Enter to add • Backspace to remove last • Click × to remove specific tags
        </p>
      )}
    </div>
  );
}