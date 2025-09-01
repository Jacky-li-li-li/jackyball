'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'

interface Team {
  _id: string
  name: string
  description: string
  sport: string
  logo: string
  owner: {
    _id: string
    name: string
    avatar: string
  }
  members: Array<{
    user: {
      _id: string
      name: string
      avatar: string
    }
    role: string
    joinedAt: string
  }>
  isPrivate: boolean
  createdAt: string
}

export default function TeamsPage() {
  const { data: session } = useSession()
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'my' | 'all'>('my')

  useEffect(() => {
    fetchTeams()
  }, [activeTab, session])

  const fetchTeams = async () => {
    if (!session?.user?.id && activeTab === 'my') {
      setTeams([])
      setLoading(false)
      return
    }

    try {
      const url = activeTab === 'my' 
        ? `/api/teams?userId=${session?.user?.id}`
        : '/api/teams'
      
      const response = await fetch(url)
      const data = await response.json()
      setTeams(data.teams || [])
    } catch (error) {
      console.error('Failed to fetch teams:', error)
    } finally {
      setLoading(false)
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

  const getUserRole = (team: Team) => {
    if (!session?.user?.id) return null
    
    if (team.owner._id === session.user.id) return 'owner'
    
    const member = team.members.find(m => m.user._id === session.user.id)
    return member?.role || null
  }

  const getRoleLabel = (role: string) => {
    const labels = {
      owner: '队长',
      admin: '管理员',
      member: '队员'
    }
    return labels[role as keyof typeof labels] || role
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">球队管理</h1>
        <Link href="/teams/create" className="btn-primary">
          创建球队
        </Link>
      </div>

      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8 w-fit">
        <button
          onClick={() => setActiveTab('my')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'my'
              ? 'bg-white text-hupu-orange shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          我的球队
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'all'
              ? 'bg-white text-hupu-orange shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          所有球队
        </button>
      </div>

      {teams.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-gray-500 text-lg mb-4">
            {activeTab === 'my' ? '你还没有加入任何球队' : '暂无球队'}
          </p>
          {activeTab === 'my' && (
            <Link href="/teams/create" className="btn-primary">
              创建第一个球队
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => {
            const userRole = getUserRole(team)
            return (
              <div key={team._id} className="card hover:shadow-lg transition-shadow">
                <Link href={`/teams/${team._id}`}>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 flex-shrink-0">
                      {team.logo ? (
                        <Image
                          src={team.logo}
                          alt={team.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-hupu-orange to-orange-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-xl">
                            {team.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-gray-900 truncate">
                        {team.name}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>{getSportLabel(team.sport)}</span>
                        {team.isPrivate && (
                          <>
                            <span>•</span>
                            <span className="text-yellow-600">私密</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {team.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4 text-gray-500">
                      <span>{team.members.length} 成员</span>
                      <span>队长: {team.owner.name}</span>
                    </div>
                    {userRole && (
                      <span className="bg-hupu-orange text-white px-2 py-1 rounded text-xs">
                        {getRoleLabel(userRole)}
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}