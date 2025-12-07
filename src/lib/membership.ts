import prisma from './prisma';
import { isWithinFreeAccess } from './utils';

const FREE_ACCESS_DAYS = parseInt(process.env.FREE_ACCESS_DAYS || '7', 10);

export interface MembershipInfo {
  isPremium: boolean;
  status: string;
  currentPeriodEnd: Date | null;
}

export async function getMembershipInfo(userId: string | null): Promise<MembershipInfo> {
  if (!userId) {
    return { isPremium: false, status: 'FREE', currentPeriodEnd: null };
  }

  const membership = await prisma.membership.findUnique({
    where: { userId },
  });

  if (!membership) {
    return { isPremium: false, status: 'FREE', currentPeriodEnd: null };
  }

  const isPremium = membership.status === 'ACTIVE' && 
    (!membership.currentPeriodEnd || new Date(membership.currentPeriodEnd) > new Date());

  return {
    isPremium,
    status: membership.status,
    currentPeriodEnd: membership.currentPeriodEnd,
  };
}

export function canAccessPost(
  post: { isPremium: boolean; publishAt: Date | null },
  membershipInfo: MembershipInfo
): { canAccess: boolean; reason?: string } {
  // Premium users can access everything
  if (membershipInfo.isPremium) {
    return { canAccess: true };
  }

  // Non-premium users can access non-premium posts
  if (!post.isPremium) {
    // But check if it's in the archive (older than FREE_ACCESS_DAYS)
    if (post.publishAt && !isWithinFreeAccess(post.publishAt, FREE_ACCESS_DAYS)) {
      return { 
        canAccess: false, 
        reason: 'This article is part of our archive. Subscribe to Premium for full archive access.' 
      };
    }
    return { canAccess: true };
  }

  // Non-premium users cannot access premium posts
  return { 
    canAccess: false, 
    reason: 'This is a premium article. Subscribe to access.' 
  };
}

export async function createOrUpdateMembership(
  userId: string,
  data: {
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    status: string;
    currentPeriodEnd?: Date;
  }
) {
  return prisma.membership.upsert({
    where: { userId },
    create: {
      userId,
      ...data,
    },
    update: data,
  });
}
