import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { connectToDatabase } from '../../../../lib/db'
import Team from '../../../../lib/models/Team'
import User from '../../../../lib/models/User'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectToDatabase()

    const { email } = await req.json()
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const team = await Team.findById(params.id)
    if (!team) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      )
    }

    const userMember = team.members.find(
      (member: any) => member.user.toString() === session.user.id
    )
    
    if (!userMember || !['owner', 'admin'].includes(userMember.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const existingInvitation = team.invitations.find(
      (inv: any) => inv.email === email && inv.status === 'pending'
    )

    if (existingInvitation) {
      return NextResponse.json(
        { error: 'User already invited' },
        { status: 400 }
      )
    }

    const invitedUser = await User.findOne({ email })
    if (invitedUser) {
      const isAlreadyMember = team.members.some(
        (member: any) => member.user.toString() === invitedUser._id.toString()
      )

      if (isAlreadyMember) {
        return NextResponse.json(
          { error: 'User is already a team member' },
          { status: 400 }
        )
      }
    }

    team.invitations.push({
      email,
      invitedBy: session.user.id,
      invitedAt: new Date(),
      status: 'pending',
    })

    await team.save()

    return NextResponse.json(
      { message: 'Invitation sent successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error sending invitation:', error)
    return NextResponse.json(
      { error: 'Failed to send invitation' },
      { status: 500 }
    )
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectToDatabase()

    const team = await Team.findById(params.id)
      .populate('invitations.invitedBy', 'name avatar')

    if (!team) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      )
    }

    const userMember = team.members.find(
      (member: any) => member.user.toString() === session.user.id
    )
    
    if (!userMember || !['owner', 'admin'].includes(userMember.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      invitations: team.invitations,
    })
  } catch (error) {
    console.error('Error fetching invitations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch invitations' },
      { status: 500 }
    )
  }
}