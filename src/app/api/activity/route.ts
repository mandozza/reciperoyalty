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
    const skip = (page - 1) * limit;

    // Get activities from users the current user follows and their own activities
    const activities = await Activity.find({
      $or: [
        { actor: { $in: [...currentUser.following, currentUser._id] } },
        { targetUser: currentUser._id },
      ],
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('actor', 'name avatar')
      .populate('recipe', 'title slug media')
      .populate('cookbook', 'title description coverImage')
      .populate('comment', 'content')
      .populate('targetUser', 'name avatar');

    // Get total count for pagination
    const total = await Activity.countDocuments({
      $or: [
        { actor: { $in: [...currentUser.following, currentUser._id] } },
        { targetUser: currentUser._id },
      ],
    });

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
