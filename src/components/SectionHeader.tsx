interface SectionHeaderProps {
  title: string;
  href?: string;
}

export default function SectionHeader({ title, href }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b-2 border-gray-900 pb-2 mb-4">
      <h2 className="text-lg font-serif font-bold text-gray-900 uppercase tracking-wide">
        {title}
      </h2>
      {href && (
        <a
          href={href}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          See all →
        </a>
      )}
    </div>
  );
}
