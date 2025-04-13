import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { ActivityItem } from './ActivityItem';
import { Skeleton } from '@/components/ui/skeleton';
import { useSession } from 'next-auth/react';

interface Activity {
  _id: string;
  type: string;
  actor: {
    _id: string;
    name: string;
    avatar?: string;
  };
  recipe?: {
    _id: string;
    title: string;
    slug: string;
    media: Array<{ url: string; type: string }>;
  };
  cookbook?: {
    _id: string;
    title: string;
    description?: string;
    coverImage?: string;
  };
  comment?: {
    _id: string;
    content: string;
  };
  targetUser?: {
    _id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
}

interface ActivityFeedProps {
  userId?: string; // Optional: to show only a specific user's activity
  className?: string;
}

export function ActivityFeed({ userId, className = '' }: ActivityFeedProps) {
  const { data: session } = useSession();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView();

  const fetchActivities = async () => {
    try {
      const url = new URL('/api/activity', window.location.origin);
      url.searchParams.append('page', page.toString());
      if (userId) {
        url.searchParams.append('userId', userId);
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch activities');

      const data = await res.json();

      if (page === 1) {
        setActivities(data.activities);
      } else {
        setActivities(prev => [...prev, ...data.activities]);
      }

      setHasMore(data.pagination.page < data.pagination.pages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchActivities();
    }
  }, [session, page, userId]);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  }, [inView, hasMore, loading]);

  if (!session?.user) {
    return null;
  }

  if (loading && activities.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-start space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!loading && activities.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No activities to show
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {activities.map((activity) => (
        <ActivityItem key={activity._id} activity={activity} />
      ))}

      {hasMore && (
        <div ref={ref} className="h-10 flex items-center justify-center">
          <Skeleton className="h-4 w-1/3" />
        </div>
      )}
    </div>
  );
}
