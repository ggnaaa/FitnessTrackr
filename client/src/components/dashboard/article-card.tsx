interface ArticleCardProps {
  imageUrl: string;
  category: string;
  title: string;
  summary: string;
  readTime: number;
  onReadClick?: () => void;
  id: number;
}

export function ArticleCard({
  imageUrl,
  category,
  title,
  summary,
  readTime,
  onReadClick,
  id,
}: ArticleCardProps) {
  return (
    <div className="rounded-lg overflow-hidden shadow-sm border border-gray-100">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <span className="text-xs font-medium text-primary bg-indigo-50 px-2 py-1 rounded-full">
          {category}
        </span>
        <h4 className="font-medium mt-2">{title}</h4>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{summary}</p>
        <div className="flex justify-between items-center mt-3">
          <span className="text-xs text-gray-500">{readTime} min read</span>
          <button 
            onClick={onReadClick} 
            className="text-primary text-sm"
          >
            Read
          </button>
        </div>
      </div>
    </div>
  );
}
