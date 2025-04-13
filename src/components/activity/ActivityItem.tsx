import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';

interface ActivityItemProps {
  activity: {
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
  };
}

export function ActivityItem({ activity }: ActivityItemProps) {
  const getActivityMessage = () => {
    switch (activity.type) {
      case 'recipe_create':
        return (
          <>
            created a new recipe{' '}
            <Link href={`/recipes/${activity.recipe?.slug}`} className="font-medium hover:underline">
              {activity.recipe?.title}
            </Link>
          </>
        );
      case 'recipe_like':
        return (
          <>
            liked{' '}
            <Link href={`/recipes/${activity.recipe?.slug}`} className="font-medium hover:underline">
              {activity.recipe?.title}
            </Link>
          </>
        );
      case 'recipe_comment':
        return (
          <>
            commented on{' '}
            <Link href={`/recipes/${activity.recipe?.slug}`} className="font-medium hover:underline">
              {activity.recipe?.title}
            </Link>
            : "{activity.comment?.content}"
          </>
        );
      case 'cookbook_create':
        return (
          <>
            created a new cookbook{' '}
            <Link href={`/cookbooks/${activity.cookbook?._id}`} className="font-medium hover:underline">
              {activity.cookbook?.title}
            </Link>
          </>
        );
      case 'cookbook_add_recipe':
        return (
          <>
            added{' '}
            <Link href={`/recipes/${activity.recipe?.slug}`} className="font-medium hover:underline">
              {activity.recipe?.title}
            </Link>{' '}
            to{' '}
            <Link href={`/cookbooks/${activity.cookbook?._id}`} className="font-medium hover:underline">
              {activity.cookbook?.title}
            </Link>
          </>
        );
      case 'user_follow':
        return (
          <>
            started following{' '}
            <Link href={`/profile/${activity.targetUser?._id}`} className="font-medium hover:underline">
              {activity.targetUser?.name}
            </Link>
          </>
        );
      case 'user_mention':
        return (
          <>
            mentioned{' '}
            <Link href={`/profile/${activity.targetUser?._id}`} className="font-medium hover:underline">
              {activity.targetUser?.name}
            </Link>{' '}
            in a comment
          </>
        );
      default:
        return 'performed an action';
    }
  };

  return (
    <div className="flex items-start space-x-4 p-4 rounded-lg bg-card">
      <Link href={`/profile/${activity.actor._id}`} className="shrink-0">
        <Avatar>
          <AvatarImage src={activity.actor.avatar} alt={activity.actor.name} />
          <AvatarFallback>{getInitials(activity.actor.name)}</AvatarFallback>
        </Avatar>
      </Link>

      <div className="flex-1 space-y-1">
        <div className="text-sm">
          <Link href={`/profile/${activity.actor._id}`} className="font-medium hover:underline">
            {activity.actor.name}
          </Link>{' '}
          {getActivityMessage()}
        </div>

        <p className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
        </p>
      </div>
    </div>
  );
}
