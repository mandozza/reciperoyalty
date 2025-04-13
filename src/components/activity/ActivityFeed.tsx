import { useEffect, useState, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { ActivityItem } from '@/components/activity/ActivityItem';
import { ActivityGroup, type GroupedActivity } from './ActivityGroup';
import { type Reaction } from './ReactionBar';
import { Skeleton } from '@/components/ui/skeleton';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  reactions?: Array<Reaction>;
  userReactions?: string[];
}

interface ActivityFeedProps {
  userId?: string;
  className?: string;
  groupSimilar?: boolean;
}

type ActivityFilter = 'all' | 'recipes' | 'cookbooks' | 'social';

const ACTIVITY_FILTERS: { value: ActivityFilter; label: string }[] = [
  { value: 'all', label: 'All Activities' },
  { value: 'recipes', label: 'Recipes' },
  { value: 'cookbooks', label: 'Cookbooks' },
  { value: 'social', label: 'Social' },
];

const GROUPING_TIME_WINDOW = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export function ActivityFeed({ userId, className = '', groupSimilar = true }: ActivityFeedProps) {
  const { data: session } = useSession();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [activeFilter, setActiveFilter] = useState<ActivityFilter>('all');
  const { ref, inView } = useInView();

  const fetchActivities = async () => {
    try {
      const url = new URL('/api/activity', window.location.origin);
      url.searchParams.append('page', page.toString());
      if (userId) {
        url.searchParams.append('userId', userId);
      }
      if (activeFilter !== 'all') {
        url.searchParams.append('filter', activeFilter);
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
      setPage(1); // Reset page when filter changes
      setActivities([]); // Clear existing activities
      fetchActivities();
    }
  }, [session, activeFilter, userId]);

  useEffect(() => {
    if (inView && hasMore && !loading && page > 1) {
      fetchActivities();
    }
  }, [inView, hasMore, loading]);

  const filteredActivities = useMemo(() => {
    if (activeFilter === 'all') return activities;

    return activities.filter(activity => {
      switch (activeFilter) {
        case 'recipes':
          return activity.type.startsWith('recipe_');
        case 'cookbooks':
          return activity.type.startsWith('cookbook_');
        case 'social':
          return activity.type.startsWith('user_');
        default:
          return true;
      }
    });
  }, [activities, activeFilter]);

  const groupedActivities = useMemo(() => {
    if (!groupSimilar) return [];

    const groups: GroupedActivity[] = [];
    const now = Date.now();

    filteredActivities.forEach((activity) => {
      const activityTime = new Date(activity.createdAt).getTime();
      if (now - activityTime > GROUPING_TIME_WINDOW) {
        return; // Skip activities older than the grouping window
      }

      // Find an existing group for this activity
      const existingGroup = groups.find(group => {
        // Group by type and target (recipe, cookbook, or user)
        const sameType = group.type === activity.type;
        let sameTarget = false;

        if (activity.recipe) {
          sameTarget = activity.recipe._id === group.target?.id && group.target.type === 'recipe';
        } else if (activity.cookbook) {
          sameTarget = activity.cookbook._id === group.target?.id && group.target.type === 'cookbook';
        } else if (activity.targetUser) {
          sameTarget = activity.targetUser._id === group.target?.id && group.target.type === 'user';
        }

        return sameType && sameTarget;
      });

      if (existingGroup) {
        // Add user to existing group if not already present
        if (!existingGroup.users.some(u => u.id === activity.actor._id)) {
          existingGroup.users.push({
            id: activity.actor._id,
            name: activity.actor.name,
            avatarUrl: activity.actor.avatar,
          });
        }
        // Update timestamp if this activity is more recent
        const activityDate = new Date(activity.createdAt);
        if (activityDate > existingGroup.timestamp) {
          existingGroup.timestamp = activityDate;
        }
      } else {
        // Create a new group
        const newGroup: GroupedActivity = {
          id: activity._id,
          type: activity.type,
          users: [{
            id: activity.actor._id,
            name: activity.actor.name,
            avatarUrl: activity.actor.avatar,
          }],
          timestamp: new Date(activity.createdAt),
          reactions: activity.reactions,
          userReactions: activity.userReactions,
        };

        // Add target information
        if (activity.recipe) {
          newGroup.target = {
            type: 'recipe',
            id: activity.recipe._id,
            name: activity.recipe.title,
            preview: activity.recipe.media?.[0] ? {
              type: activity.recipe.media[0].type as 'image' | 'video',
              content: activity.recipe.media[0].url,
              thumbnailUrl: activity.recipe.media[0].url,
            } : undefined,
          };
        } else if (activity.cookbook) {
          newGroup.target = {
            type: 'cookbook',
            id: activity.cookbook._id,
            name: activity.cookbook.title,
            preview: activity.cookbook.coverImage ? {
              type: 'image',
              content: activity.cookbook.coverImage,
              thumbnailUrl: activity.cookbook.coverImage,
            } : undefined,
          };
        } else if (activity.targetUser) {
          newGroup.target = {
            type: 'user',
            id: activity.targetUser._id,
            name: activity.targetUser.name,
          };
        }

        groups.push(newGroup);
      }
    });

    return groups.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [filteredActivities, groupSimilar]);

  const handleUserClick = (userId: string) => {
    window.location.href = `/profile/${userId}`;
  };

  const handleTargetClick = (type: string, id: string) => {
    switch (type) {
      case 'recipe':
        window.location.href = `/recipes/${id}`;
        break;
      case 'cookbook':
        window.location.href = `/cookbooks/${id}`;
        break;
      case 'user':
        window.location.href = `/profile/${id}`;
        break;
    }
  };

  const handleReaction = async (activityId: string, emoji: string) => {
    try {
      const response = await fetch(`/api/activity/${activityId}/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emoji }),
      });

      if (!response.ok) throw new Error('Failed to add reaction');

      // Refresh activities to get updated reactions
      fetchActivities();
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  const handleRemoveReaction = async (activityId: string, emoji: string) => {
    try {
      const response = await fetch(`/api/activity/${activityId}/react`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emoji }),
      });

      if (!response.ok) throw new Error('Failed to remove reaction');

      // Refresh activities to get updated reactions
      fetchActivities();
    } catch (error) {
      console.error('Error removing reaction:', error);
    }
  };

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
    <div className={cn("space-y-4", className)}>
      <Tabs
        defaultValue="all"
        value={activeFilter}
        onValueChange={(value) => setActiveFilter(value as ActivityFilter)}
        className="w-full"
      >
        <TabsList className="w-full justify-start">
          {ACTIVITY_FILTERS.map(filter => (
            <TabsTrigger
              key={filter.value}
              value={filter.value}
              className="flex-1 sm:flex-none"
            >
              {filter.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {loading ? (
        // Loading skeletons
        Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-[200px] w-full" />
        ))
      ) : filteredActivities.length === 0 ? (
        // Empty state
        <div className="text-center py-8 text-muted-foreground">
          No activities to show
        </div>
      ) : groupSimilar ? (
        // Grouped activities
        <>
          {groupedActivities.map((group) => (
            <ActivityGroup
              key={group.id}
              activities={[group]}
              onUserClick={handleUserClick}
              onTargetClick={handleTargetClick}
              onReact={handleReaction}
              onRemoveReaction={handleRemoveReaction}
            />
          ))}
          {!loading && hasMore && (
            <div ref={ref} className="h-10" />
          )}
        </>
      ) : (
        // Individual activities
        <>
          {filteredActivities.map((activity) => (
            <ActivityItem key={activity._id} activity={activity} />
          ))}
          {!loading && hasMore && (
            <div ref={ref} className="h-10" />
          )}
        </>
      )}
    </div>
  );
}
