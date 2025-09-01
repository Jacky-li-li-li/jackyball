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

    const { action } = await req.json() // 'accept' or 'decline'
    
    const team = await Team.findById(params.id)
    if (!team) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      )
    }

    const user = await User.findById(session.user.id)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const invitation = team.invitations.find(
      (inv: any) => inv.email === user.email && inv.status === 'pending'
    )

    if (!invitation) {
      return NextResponse.json(
        { error: 'No pending invitation found' },
        { status: 404 }
      )
    }

    if (action === 'accept') {
      const isAlreadyMember = team.members.some(
        (member: any) => member.user.toString() === session.user.id
      )

      if (!isAlreadyMember) {
        team.members.push({
          user: session.user.id,
          role: 'member',
          joinedAt: new Date(),
        })

        user.teams.push(team._id)
        await user.save()
      }

      invitation.status = 'accepted'
    } else if (action === 'decline') {
      invitation.status = 'declined'
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      )
    }

    await team.save()

    return NextResponse.json(
      { 
        message: action === 'accept' ? 'Successfully joined team' : 'Invitation declined',
        team: action === 'accept' ? team : null 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error processing invitation:', error)
    return NextResponse.json(
      { error: 'Failed to process invitation' },
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

    const user = await User.findById(session.user.id)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const teams = await Team.find({
      'invitations.email': user.email,
      'invitations.status': 'pending'
    })
    .populate('owner', 'name avatar')
    .populate('invitations.invitedBy', 'name avatar')

    const invitations = teams.map(team => {
      const invitation = team.invitations.find(
        (inv: any) => inv.email === user.email && inv.status === 'pending'
      )
      
      return {
        _id: invitation._id,
        team: {
          _id: team._id,
          name: team.name,
          description: team.description,
          sport: team.sport,
          logo: team.logo,
          owner: team.owner,
          membersCount: team.members.length,
        },
        invitedBy: invitation.invitedBy,
        invitedAt: invitation.invitedAt,
      }
    })

    return NextResponse.json({ invitations })
  } catch (error) {
    console.error('Error fetching user invitations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch invitations' },
      { status: 500 }
    )
  }
}