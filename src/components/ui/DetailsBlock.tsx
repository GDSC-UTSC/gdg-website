interface DetailItem {
  label: string;
  value: string;
}

interface DetailsBlockProps {
  title: string;
  details: DetailItem[];
}

export function DetailsBlock({ title, details }: DetailsBlockProps) {
  return (
    <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6">
      <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
      <div className="space-y-3 text-sm">
        {details.map((detail, index) => (
          <div key={index} className="flex justify-between">
            <span className="text-gray-400">{detail.label}:</span>
            <span className="text-gray-300">{detail.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}