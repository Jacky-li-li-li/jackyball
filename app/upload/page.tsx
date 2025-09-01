'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import MediaUpload from '../components/MediaUpload'
import Image from 'next/image'

interface Team {
  _id: string
  name: string
  logo: string
}

interface UploadedMedia {
  _id: string
  url: string
  type: 'image' | 'video'
  originalName: string
  size: number
  description: string
  tags: string[]
  uploadedBy: {
    name: string
    avatar: string
  }
  createdAt: string
}

export default function UploadPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [selectedTeam, setSelectedTeam] = useState<string>('')
  const [teams, setTeams] = useState<Team[]>([])
  const [uploadedMedia, setUploadedMedia] = useState<UploadedMedia[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/signin')
      return
    }

    fetchUserTeams()
  }, [session, status, router])

  const fetchUserTeams = async () => {
    try {
      const response = await fetch(`/api/teams?userId=${session?.user?.id}`)
      const data = await response.json()
      setTeams(data.teams || [])
    } catch (error) {
      console.error('Failed to fetch teams:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUploadComplete = (media: UploadedMedia) => {
    setUploadedMedia(prev => [media, ...prev])
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (status === 'loading' || loading) {
    return <div className="min-h-screen flex items-center justify-center">加载中...</div>
  }

  if (!session) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">上传媒体文件</h1>
        <p className="text-gray-600">
          上传图片和视频到你的球队，支持任意大小的文件
        </p>
      </div>

      <div className="card mb-8">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            选择球队 (可选)
          </label>
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-hupu-orange focus:border-hupu-orange"
          >
            <option value="">个人文件</option>
            {teams.map(team => (
              <option key={team._id} value={team._id}>
                {team.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-sm text-gray-500">
            选择球队后，文件将上传到该球队的媒体库中
          </p>
        </div>

        <MediaUpload
          teamId={selectedTeam || undefined}
          onUploadComplete={handleUploadComplete}
        />
      </div>

      {uploadedMedia.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">最近上传</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {uploadedMedia.map((media) => (
              <div key={media._id} className="card">
                <div className="aspect-w-16 aspect-h-9 mb-4">
                  {media.type === 'image' ? (
                    <Image
                      src={media.url}
                      alt={media.originalName}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ) : (
                    <video
                      src={media.url}
                      controls
                      className="w-full h-48 object-cover rounded-lg"
                      poster={media.url.replace(/\.[^/.]+$/, '.jpg')}
                    />
                  )}
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900 truncate">
                    {media.originalName}
                  </h3>
                  
                  {media.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {media.description}
                    </p>
                  )}
                  
                  {media.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {media.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500 pt-2 border-t">
                    <p>{formatFileSize(media.size)}</p>
                    <p>{formatDate(media.createdAt)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}