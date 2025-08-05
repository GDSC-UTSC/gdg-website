interface TagListProps {
  tags: string[];
  variant?: "primary" | "secondary";
}

export function TagList({ tags, variant = "primary" }: TagListProps) {
  const baseClasses = "px-3 py-2 rounded-full text-sm font-medium transition-transform hover:scale-105";
  const variantClasses = variant === "primary" 
    ? "bg-primary/10 text-primary"
    : "bg-secondary/20 text-secondary-foreground";

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, idx) => (
        <span
          key={idx}
          className={`${baseClasses} ${variantClasses}`}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}