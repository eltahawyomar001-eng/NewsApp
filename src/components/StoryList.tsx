import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { Crown, Clock } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  slug: string;
  summary: string;
  externalUrl: string;
  imageUrl: string | null;
  isPremium: boolean;
  publishAt: Date | null;
  category: {
    name: string;
    slug: string;
  };
}

interface StoryListProps {
  posts: Post[];
  showCategory?: boolean;
}

export default function StoryList({ posts, showCategory = true }: StoryListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No stories available at the moment.
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {posts.map((post) => (
        <article key={post.id} className="py-4 first:pt-0 last:pb-0">
          <div className="flex gap-4">
            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Category */}
              {showCategory && (
                <Link
                  href={`/category/${post.category.slug}`}
                  className="text-xs font-semibold text-blue-600 uppercase tracking-wider hover:text-blue-800 mb-1 inline-block"
                >
                  {post.category.name}
                </Link>
              )}

              {/* Headline */}
              <h3 className="mb-1">
                <a
                  href={post.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-gray-900 hover:text-gray-600 transition-colors leading-snug line-clamp-2"
                >
                  {post.title}
                </a>
              </h3>

              {/* Summary */}
              <p className="text-sm text-gray-600 line-clamp-1 mb-2">
                {post.summary}
              </p>

              {/* Meta */}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {post.publishAt ? formatDate(post.publishAt) : 'Just now'}
                </span>
                {post.isPremium && (
                  <span className="flex items-center gap-1 text-amber-600 font-medium">
                    <Crown className="w-3 h-3" />
                    PRO
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail */}
            {post.imageUrl && (
              <a
                href={post.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 w-20 h-20 bg-gray-100 overflow-hidden"
              >
                <img
                  src={post.imageUrl}
                  alt=""
                  className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                />
              </a>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
