'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface NewsItem {
  _id: string
  title: string
  summary: string
  author: {
    name: string
  }
  category: string
  featuredImage: string
  views: number
  likes: string[]
  comments: any[]
  createdAt: string
  isFeatured: boolean
}

export default function NewsList() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('all')

  useEffect(() => {
    fetchNews()
  }, [category])

  const fetchNews = async () => {
    try {
      const url = category === 'all' ? '/api/news' : `/api/news?category=${category}`
      const response = await fetch(url)
      const data = await response.json()
      setNews(data.news || [])
    } catch (error) {
      console.error('Failed to fetch news:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { value: 'all', label: '全部' },
    { value: 'basketball', label: '篮球' },
    { value: 'football', label: '橄榄球' },
    { value: 'soccer', label: '足球' },
    { value: 'volleyball', label: '排球' },
    { value: 'tennis', label: '网球' },
    { value: 'general', label: '综合' },
  ]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (hours < 1) return '刚刚'
    if (hours < 24) return `${hours}小时前`
    if (hours < 24 * 7) return `${Math.floor(hours / 24)}天前`
    return date.toLocaleDateString('zh-CN')
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="news-card animate-pulse">
            <div className="flex space-x-4">
              <div className="w-32 h-24 bg-gray-200 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">体育新闻</h2>
        <div className="flex space-x-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                category === cat.value
                  ? 'bg-hupu-orange text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {news.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">暂无新闻</p>
          </div>
        ) : (
          news.map((item) => (
            <article key={item._id} className="news-card">
              <Link href={`/news/${item._id}`}>
                <div className="flex space-x-4">
                  {item.featuredImage && (
                    <div className="w-32 h-24 flex-shrink-0">
                      <Image
                        src={item.featuredImage}
                        alt={item.title}
                        width={128}
                        height={96}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      {item.isFeatured && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                          置顶
                        </span>
                      )}
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                        {categories.find(cat => cat.value === item.category)?.label || item.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-hupu-orange transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {item.summary}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span>{item.author?.name || '匿名'}</span>
                        <span>{formatDate(item.createdAt)}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span>{item.views} 阅读</span>
                        <span>{item.likes?.length || 0} 点赞</span>
                        <span>{item.comments?.length || 0} 评论</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))
        )}
      </div>
    </div>
  )
}