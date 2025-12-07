import { Flame } from 'lucide-react';

interface TrendingPost {
  id: string;
  title: string;
  externalUrl: string;
  views: number;
  category: {
    name: string;
  };
}

interface TrendingListProps {
  posts: TrendingPost[];
}

export default function TrendingList({ posts }: TrendingListProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <div className="flex items-center gap-2 mb-4">
        <Flame className="w-5 h-5 text-orange-500" />
        <h3 className="font-semibold text-gray-900">Trending Now</h3>
      </div>
      <ol className="space-y-4">
        {posts.slice(0, 5).map((post, index) => (
          <li key={post.id} className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded text-sm font-bold text-gray-600 flex items-center justify-center">
              {index + 1}
            </span>
            <div className="flex-1 min-w-0">
              <a
                href={post.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors line-clamp-2 leading-snug"
              >
                {post.title}
              </a>
              <p className="text-xs text-gray-500 mt-0.5">
                {post.category.name}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
