import AdminSidebar from '@/components/admin/AdminSidebar';
import prisma from '@/lib/prisma';
import { FileText, Calendar, Users, Eye } from 'lucide-react';

async function getDashboardStats() {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const [
    totalPosts,
    publishedToday,
    scheduledPosts,
    totalSubscribers,
    premiumMembers,
    recentPosts,
  ] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({
      where: {
        status: 'PUBLISHED',
        publishAt: { gte: startOfDay },
      },
    }),
    prisma.post.count({
      where: {
        status: 'SCHEDULED',
        publishAt: { gt: now },
      },
    }),
    prisma.newsletterSubscriber.count(),
    prisma.membership.count({
      where: { status: 'ACTIVE' },
    }),
    prisma.post.findMany({
      where: {
        OR: [
          { status: 'PUBLISHED' },
          { status: 'SCHEDULED' },
        ],
      },
      include: {
        category: true,
        author: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
  ]);

  return {
    totalPosts,
    publishedToday,
    scheduledPosts,
    totalSubscribers,
    premiumMembers,
    recentPosts,
  };
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here&apos;s what&apos;s happening today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Posts"
            value={stats.totalPosts}
            icon={FileText}
            color="blue"
          />
          <StatCard
            title="Published Today"
            value={stats.publishedToday}
            icon={Eye}
            color="green"
          />
          <StatCard
            title="Scheduled"
            value={stats.scheduledPosts}
            icon={Calendar}
            color="yellow"
          />
          <StatCard
            title="Premium Members"
            value={stats.premiumMembers}
            icon={Users}
            color="purple"
          />
        </div>

        {/* Recent Posts */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Posts</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {stats.recentPosts.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                No posts yet. Create your first post!
              </div>
            ) : (
              stats.recentPosts.map((post) => (
                <div key={post.id} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-500">
                        {post.category.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        by {post.author.name || 'Unknown'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={post.status} />
                    {post.isPremium && (
                      <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-medium">
                        PRO
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  color: 'blue' | 'green' | 'yellow' | 'purple';
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusClasses: Record<string, string> = {
    PUBLISHED: 'bg-green-100 text-green-800',
    SCHEDULED: 'bg-blue-100 text-blue-800',
    DRAFT: 'bg-gray-100 text-gray-800',
  };

  return (
    <span className={`text-xs px-2 py-0.5 rounded font-medium ${statusClasses[status] || statusClasses.DRAFT}`}>
      {status}
    </span>
  );
}
