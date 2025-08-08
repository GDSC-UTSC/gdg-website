interface AboutBlockProps {
  title: string;
  description: string;
}

export function AboutBlock({ title, description }: AboutBlockProps) {
  return (
    <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
      <p className="text-gray-300 leading-relaxed text-lg">{description}</p>
    </div>
  );
}