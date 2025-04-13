import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Activity from '@/models/Activity';
import User from '@/models/User';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Get current user
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get query parameters
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const filter = searchParams.get('filter') || 'all';
    const userId = searchParams.get('userId');
    const skip = (page - 1) * limit;

    // Build base query
    let query: any = {};

    // Add user filter if specified
    if (userId) {
      query.actor = userId;
    } else {
      // Default to following + own activities
      query.$or = [
        { actor: { $in: [...currentUser.following, currentUser._id] } },
        { targetUser: currentUser._id },
      ];
    }

    // Add type filter if specified
    if (filter !== 'all') {
      let typePattern: string;
      switch (filter) {
        case 'recipes':
          typePattern = '^recipe_';
          break;
        case 'cookbooks':
          typePattern = '^cookbook_';
          break;
        case 'social':
          typePattern = '^user_';
          break;
        default:
          typePattern = '';
      }

      if (typePattern) {
        query.type = { $regex: typePattern };
      }
    }

    // Get activities with filters
    const activities = await Activity.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('actor', 'name avatar')
      .populate('recipe', 'title slug media')
      .populate('cookbook', 'title description coverImage')
      .populate('comment', 'content')
      .populate('targetUser', 'name avatar');

    // Get total count for pagination
    const total = await Activity.countDocuments(query);

    return NextResponse.json({
      activities,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching activity feed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activity feed' },
      { status: 500 }
    );
  }
}
