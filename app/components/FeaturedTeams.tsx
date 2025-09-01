'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Team {
  _id: string
  name: string
  description: string
  sport: string
  logo: string
  owner: {
    name: string
  }
  members: any[]
  createdAt: string
}

export default function FeaturedTeams() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedTeams()
  }, [])

  const fetchFeaturedTeams = async () => {
    try {
      const response = await fetch('/api/teams?featured=true&limit=5')
      const data = await response.json()
      setTeams(data.teams || [])
    } catch (error) {
      console.error('Failed to fetch featured teams:', error)
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

  if (loading) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">热门球队</h3>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">热门球队</h3>
        <Link href="/teams" className="text-hupu-orange hover:text-orange-600 text-sm">
          查看更多
        </Link>
      </div>
      
      <div className="space-y-4">
        {teams.length === 0 ? (
          <p className="text-gray-500 text-center py-4">暂无球队</p>
        ) : (
          teams.map((team) => (
            <Link key={team._id} href={`/teams/${team._id}`}>
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-12 h-12 flex-shrink-0">
                  {team.logo ? (
                    <Image
                      src={team.logo}
                      alt={team.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-hupu-orange to-orange-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {team.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">
                    {team.name}
                  </h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>{getSportLabel(team.sport)}</span>
                    <span>•</span>
                    <span>{team.members?.length || 0} 成员</span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <Link
          href="/teams/create"
          className="block w-full text-center bg-hupu-orange text-white py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium"
        >
          创建球队
        </Link>
      </div>
    </div>
  )
}