import prisma from './prisma';

export type AdPosition = 'TOP_BANNER' | 'SIDEBAR' | 'INLINE';

export async function getActiveAds(position: AdPosition) {
  const now = new Date();
  
  const ads = await prisma.ad.findMany({
    where: {
      position,
      isActive: true,
      OR: [
        {
          AND: [
            { activeFrom: { lte: now } },
            { activeTo: { gte: now } },
          ],
        },
        {
          AND: [
            { activeFrom: null },
            { activeTo: null },
          ],
        },
        {
          AND: [
            { activeFrom: { lte: now } },
            { activeTo: null },
          ],
        },
        {
          AND: [
            { activeFrom: null },
            { activeTo: { gte: now } },
          ],
        },
      ],
    },
  });
  
  return ads;
}

export async function getRandomAd(position: AdPosition) {
  const ads = await getActiveAds(position);
  if (ads.length === 0) return null;
  
  // Random selection from active ads
  const randomIndex = Math.floor(Math.random() * ads.length);
  return ads[randomIndex];
}

export async function getRandomAds(position: AdPosition, count: number = 1) {
  const ads = await getActiveAds(position);
  if (ads.length === 0) return [];
  
  // Shuffle and take count
  const shuffled = [...ads].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, ads.length));
}
