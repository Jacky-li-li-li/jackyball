'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-hupu-orange">体育之家</h1>
            </Link>
            
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link href="/" className="nav-link">
                首页
              </Link>
              <Link href="/news" className="nav-link">
                体育新闻
              </Link>
              <Link href="/teams" className="nav-link">
                我的球队
              </Link>
              <Link href="/teams/create" className="nav-link">
                创建球队
              </Link>
            </div>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4">
            {session ? (
              <>
                <Link href="/profile" className="nav-link">
                  {session.user?.name || '个人中心'}
                </Link>
                <button
                  onClick={() => signOut()}
                  className="btn-secondary"
                >
                  退出登录
                </button>
              </>
            ) : (
              <Link href="/auth/signin" className="btn-primary">
                微信登录
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            <Link href="/" className="block px-3 py-2 nav-link">
              首页
            </Link>
            <Link href="/news" className="block px-3 py-2 nav-link">
              体育新闻
            </Link>
            <Link href="/teams" className="block px-3 py-2 nav-link">
              我的球队
            </Link>
            <Link href="/teams/create" className="block px-3 py-2 nav-link">
              创建球队
            </Link>
            {session ? (
              <>
                <Link href="/profile" className="block px-3 py-2 nav-link">
                  个人中心
                </Link>
                <button
                  onClick={() => signOut()}
                  className="block w-full text-left px-3 py-2 nav-link"
                >
                  退出登录
                </button>
              </>
            ) : (
              <Link href="/auth/signin" className="block px-3 py-2 nav-link">
                微信登录
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}