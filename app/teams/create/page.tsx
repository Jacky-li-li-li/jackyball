'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Image from 'next/image'

export default function CreateTeam() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sport: 'basketball',
    logo: '',
    isPrivate: false,
  })

  const sports = [
    { value: 'basketball', label: '篮球' },
    { value: 'football', label: '橄榄球' },
    { value: 'soccer', label: '足球' },
    { value: 'volleyball', label: '排球' },
    { value: 'tennis', label: '网球' },
    { value: 'other', label: '其他' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!session?.user?.id) {
      setError('请先登录')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        router.push(`/teams/${data.team._id}`)
      } else {
        setError(data.error || '创建球队失败')
      }
    } catch (error) {
      setError('创建球队失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">加载中...</div>
  }

  if (!session) {
    router.push('/auth/signin')
    return null
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">创建球队</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              球队名称 *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-hupu-orange focus:border-hupu-orange"
              placeholder="请输入球队名称"
            />
          </div>

          <div>
            <label htmlFor="sport" className="block text-sm font-medium text-gray-700 mb-2">
              运动类型 *
            </label>
            <select
              id="sport"
              name="sport"
              required
              value={formData.sport}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-hupu-orange focus:border-hupu-orange"
            >
              {sports.map(sport => (
                <option key={sport.value} value={sport.value}>
                  {sport.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              球队介绍 *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-hupu-orange focus:border-hupu-orange"
              placeholder="介绍一下你的球队..."
            />
          </div>

          <div>
            <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-2">
              球队Logo URL (可选)
            </label>
            <input
              type="url"
              id="logo"
              name="logo"
              value={formData.logo}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-hupu-orange focus:border-hupu-orange"
              placeholder="https://example.com/logo.png"
            />
            {formData.logo && (
              <div className="mt-2">
                <Image
                  src={formData.logo}
                  alt="Team logo preview"
                  width={64}
                  height={64}
                  className="w-16 h-16 object-cover rounded-full"
                />
              </div>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPrivate"
              name="isPrivate"
              checked={formData.isPrivate}
              onChange={handleChange}
              className="h-4 w-4 text-hupu-orange focus:ring-hupu-orange border-gray-300 rounded"
            />
            <label htmlFor="isPrivate" className="ml-2 block text-sm text-gray-900">
              私密球队（仅受邀请的用户可以加入）
            </label>
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary disabled:opacity-50"
            >
              {loading ? '创建中...' : '创建球队'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}