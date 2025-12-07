'use client';

import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Loader2, ArrowLeft, Save, Trash2 } from 'lucide-react';
import Link from 'next/link';

const postSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  externalUrl: z.string().url('Must be a valid URL'),
  summary: z.string().min(10, 'Summary must be at least 10 characters'),
  categoryId: z.string().min(1, 'Category is required'),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  label: z.string().optional(),
  isPremium: z.boolean(),
  isFeatured: z.boolean(),
  status: z.enum(['DRAFT', 'SCHEDULED', 'PUBLISHED']),
  publishAt: z.string().optional(),
});

type PostFormData = z.infer<typeof postSchema>;

interface Category {
  id: string;
  name: string;
}

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      status: 'DRAFT',
      isPremium: false,
      isFeatured: false,
    },
  });

  const status = watch('status');

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/categories').then((res) => res.json()),
      fetch(`/api/admin/posts/${postId}`).then((res) => res.json()),
    ])
      .then(([categoriesData, postData]) => {
        setCategories(categoriesData);
        reset({
          title: postData.title,
          externalUrl: postData.externalUrl,
          summary: postData.summary,
          categoryId: postData.categoryId,
          imageUrl: postData.imageUrl || '',
          label: postData.label || '',
          isPremium: postData.isPremium,
          isFeatured: postData.isFeatured,
          status: postData.status,
          publishAt: postData.publishAt
            ? new Date(postData.publishAt).toISOString().slice(0, 16)
            : '',
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [postId, reset]);

  const onSubmit = async (data: PostFormData) => {
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          publishAt: data.publishAt ? new Date(data.publishAt).toISOString() : null,
          imageUrl: data.imageUrl || null,
        }),
      });

      if (response.ok) {
        router.push('/admin/posts');
        router.refresh();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update post');
      }
    } catch {
      alert('Failed to update post');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/admin/posts');
        router.refresh();
      } else {
        alert('Failed to delete post');
      }
    } catch {
      alert('Failed to delete post');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        <main className="flex-1 p-8 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <div className="mb-8">
          <Link
            href="/admin/posts"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Posts
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Edit Post</h1>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
            >
              {deleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              Delete
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl">
          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                {...register('title')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* External URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                External URL *
              </label>
              <input
                {...register('externalUrl')}
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.externalUrl && (
                <p className="mt-1 text-sm text-red-600">{errors.externalUrl.message}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                {...register('categoryId')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
              )}
            </div>

            {/* Summary */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Summary *
              </label>
              <textarea
                {...register('summary')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.summary && (
                <p className="mt-1 text-sm text-red-600">{errors.summary.message}</p>
              )}
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                {...register('imageUrl')}
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.imageUrl && (
                <p className="mt-1 text-sm text-red-600">{errors.imageUrl.message}</p>
              )}
            </div>

            {/* Label */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Label (Optional)
              </label>
              <input
                {...register('label')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Analysis, Opinion, Breaking, etc."
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                {...register('status')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="DRAFT">Draft</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>

            {/* Publish At */}
            {status === 'SCHEDULED' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Schedule Publish Date
                </label>
                <input
                  {...register('publishAt')}
                  type="datetime-local"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            {/* Checkboxes */}
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  {...register('isPremium')}
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Premium Article</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  {...register('isFeatured')}
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Featured (Hero)</span>
              </label>
            </div>

            {/* Submit */}
            <div className="flex items-center gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Changes
              </button>
              <Link
                href="/admin/posts"
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
