import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { Crown, Clock } from 'lucide-react';

interface HeroStoryProps {
  post: {
    id: string;
    title: string;
    slug: string;
    summary: string;
    externalUrl: string;
    imageUrl: string | null;
    isPremium: boolean;
    label: string | null;
    publishAt: Date | null;
    category: {
      name: string;
      slug: string;
    };
  };
}

export default function HeroStory({ post }: HeroStoryProps) {
  return (
    <article className="bg-white border-b border-gray-200 pb-6 mb-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Image */}
        {post.imageUrl && (
          <div className="lg:w-2/5 flex-shrink-0">
            <a
              href={post.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block aspect-[16/10] overflow-hidden bg-gray-100"
            >
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover hover:opacity-90 transition-opacity"
              />
            </a>
          </div>
        )}

        {/* Content */}
        <div className="flex-1">
          {/* Category and Label */}
          <div className="flex items-center gap-2 mb-2">
            <Link
              href={`/category/${post.category.slug}`}
              className="text-xs font-semibold text-blue-600 uppercase tracking-wider hover:text-blue-800"
            >
              {post.category.name}
            </Link>
            {post.label && (
              <>
                <span className="text-gray-300">|</span>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {post.label}
                </span>
              </>
            )}
          </div>

          {/* Headline */}
          <h1 className="mb-3">
            <a
              href={post.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl lg:text-3xl font-serif font-bold text-gray-900 leading-tight hover:text-gray-600 transition-colors tracking-tight"
            >
              {post.title}
            </a>
          </h1>

          {/* Summary */}
          <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
            {post.summary}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.publishAt ? formatDate(post.publishAt) : 'Just now'}
            </span>
            {post.isPremium && (
              <span className="flex items-center gap-1 text-amber-600 font-medium">
                <Crown className="w-3.5 h-3.5" />
                PRO
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
