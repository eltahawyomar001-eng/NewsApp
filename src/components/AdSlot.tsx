import { Ad } from '@prisma/client';

interface AdSlotProps {
  ad: Ad | null;
  position: 'TOP_BANNER' | 'SIDEBAR' | 'INLINE';
}

export default function AdSlot({ ad, position }: AdSlotProps) {
  if (!ad) {
    return null;
  }

  const getContainerClass = () => {
    switch (position) {
      case 'TOP_BANNER':
        return 'w-full bg-gray-100 border border-gray-200 rounded-lg overflow-hidden shadow-sm';
      case 'SIDEBAR':
        return 'w-full bg-gray-100 border border-gray-200 rounded-lg overflow-hidden shadow-sm';
      case 'INLINE':
        return 'w-full bg-gray-100 border border-gray-200 rounded-lg overflow-hidden shadow-sm my-8';
      default:
        return 'w-full bg-gray-100 border border-gray-200 rounded-lg overflow-hidden shadow-sm';
    }
  };

  const getImageClass = () => {
    switch (position) {
      case 'TOP_BANNER':
        return 'w-full h-[100px] object-cover';
      case 'SIDEBAR':
        return 'w-full h-[280px] object-cover';
      case 'INLINE':
        return 'w-full h-[180px] object-cover';
      default:
        return 'w-full object-cover';
    }
  };

  return (
    <div className={getContainerClass()}>
      <div className="relative">
        {/* Ad Label */}
        <span className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 text-[10px] font-semibold text-white uppercase tracking-wider rounded z-10">
          Ad
        </span>
        
        <a
          href={ad.linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block hover:opacity-95 transition-opacity"
        >
          {ad.imageUrl ? (
            <img
              src={ad.imageUrl}
              alt={ad.title}
              className={`${getImageClass()} transition-transform hover:scale-[1.02]`}
            />
          ) : (
            <div className={`${getImageClass()} bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center`}>
              <span className="text-lg font-semibold text-white px-4 text-center">{ad.title}</span>
            </div>
          )}
        </a>
      </div>
    </div>
  );
}
