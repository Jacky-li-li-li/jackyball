'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'

interface Invitation {
  _id: string
  team: {
    _id: string
    name: string
    description: string
    sport: string
    logo: string
    owner: {
      name: string
      avatar: string
    }
    membersCount: number
  }
  invitedBy: {
    name: string
    avatar: string
  }
  invitedAt: string
}

export default function TeamInvitations() {
  const { data: session } = useSession()
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user?.id) {
      fetchInvitations()
    }
  }, [session])

  const fetchInvitations = async () => {
    try {
      const response = await fetch('/api/teams/invitations')
      const data = await response.json()
      setInvitations(data.invitations || [])
    } catch (error) {
      console.error('Failed to fetch invitations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInvitation = async (teamId: string, action: 'accept' | 'decline') => {
    try {
      const response = await fetch(`/api/teams/${teamId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      })

      if (response.ok) {
        setInvitations(prev => prev.filter(inv => inv.team._id !== teamId))
        
        if (action === 'accept') {
          window.location.href = `/teams/${teamId}`
        }
      }
    } catch (error) {
      console.error('Failed to process invitation:', error)
    }
  }

  const getSportLabel = (sport: string) => {
    const labels = {
      basketball: '篮球',
      football: '橄榄球',
      soccer: '足球',
      volleyball: '排球',
      tennis: '网球',
      other: '其他'
    }
    return labels[sport as keyof typeof labels] || sport
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN')
  }

  if (!session) {
    return null
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="flex space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (invitations.length === 0) {
    return null
  }

  return (
    <div className="space-y-4 mb-8">
      <h2 className="text-xl font-semibold text-gray-900">球队邀请</h2>
      {invitations.map((invitation) => (
        <div key={invitation._id} className="card border-l-4 border-l-hupu-orange">
          <div className="flex space-x-4">
            <div className="w-16 h-16 flex-shrink-0">
              {invitation.team.logo ? (
                <Image
                  src={invitation.team.logo}
                  alt={invitation.team.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-hupu-orange to-orange-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {invitation.team.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-semibold text-lg text-gray-900">
                  {invitation.team.name}
                </h3>
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                  {getSportLabel(invitation.team.sport)}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-3">
                {invitation.team.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  <p>
                    {invitation.invitedBy.name} 邀请你加入 • {formatDate(invitation.invitedAt)}
                  </p>
                  <p>{invitation.team.membersCount} 位成员</p>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleInvitation(invitation.team._id, 'decline')}
                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    拒绝
                  </button>
                  <button
                    onClick={() => handleInvitation(invitation.team._id, 'accept')}
                    className="px-4 py-2 bg-hupu-orange text-white rounded-md hover:bg-orange-600 transition-colors"
                  >
                    接受
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}