import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { connectToDatabase } from '../../lib/db'
import Team from '../../lib/models/Team'
import User from '../../lib/models/User'

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase()

    const { searchParams } = new URL(req.url)
    const featured = searchParams.get('featured')
    const userId = searchParams.get('userId')
    const sport = searchParams.get('sport')
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')

    let query: any = {}

    if (featured === 'true') {
      query = { isPrivate: false }
    }

    if (userId) {
      query.$or = [
        { owner: userId },
        { 'members.user': userId }
      ]
    }

    if (sport && sport !== 'all') {
      query.sport = sport
    }

    const skip = (page - 1) * limit

    const teams = await Team.find(query)
      .populate('owner', 'name avatar')
      .populate('members.user', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    const total = await Team.countDocuments(query)

    return NextResponse.json({
      teams,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching teams:', error)
    return NextResponse.json(
      { error: 'Failed to fetch teams' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectToDatabase()

    const { name, description, sport, logo, isPrivate } = await req.json()

    if (!name || !description || !sport) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const team = await Team.create({
      name,
      description,
      sport,
      logo: logo || '',
      isPrivate: isPrivate || false,
      owner: session.user.id,
      members: [{
        user: session.user.id,
        role: 'owner',
        joinedAt: new Date(),
      }],
    })

    await User.findByIdAndUpdate(
      session.user.id,
      { $push: { teams: team._id } }
    )

    await team.populate([
      { path: 'owner', select: 'name avatar' },
      { path: 'members.user', select: 'name avatar' }
    ])

    return NextResponse.json(
      { message: 'Team created successfully', team },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating team:', error)
    return NextResponse.json(
      { error: 'Failed to create team' },
      { status: 500 }
    )
  }
}