'use client'

import { useState, useEffect } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function SignIn() {
  const [loading, setLoading] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const router = useRouter()

  useEffect(() => {
    // 生成微信登录二维码URL
    const generateQRCode = () => {
      const appId = process.env.NEXT_PUBLIC_WECHAT_APP_ID || 'wx_app_id'
      const redirectUri = encodeURIComponent(`${window.location.origin}/api/auth/callback/wechat`)
      const state = 'wechat_login'
      
      const qrUrl = `https://open.weixin.qq.com/connect/qrconnect?appid=${appId}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_login&state=${state}#wechat_redirect`
      setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrUrl)}`)
    }

    generateQRCode()

    // 检查是否已登录
    const checkSession = async () => {
      const session = await getSession()
      if (session) {
        router.push('/')
      }
    }
    checkSession()
  }, [router])

  const handleWeChatLogin = async () => {
    setLoading(true)
    try {
      await signIn('wechat', { 
        callbackUrl: '/',
        redirect: true 
      })
    } catch (error) {
      console.error('WeChat login error:', error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.176 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.298c-.115.37.225.696.556.542l1.903-.892c.323-.15.709-.078.985.068 1.038.548 2.224.864 3.422.864 4.8 0 8.691-3.288 8.691-7.342C18.382 5.476 14.491 2.188 9.69 2.188zm-2.46 5.695c0-.2.157-.36.35-.36h4.203c.193 0 .35.16.35.36s-.157.36-.35.36H6.581c-.193 0-.35-.16-.35-.36zm6.993 2.094c0-.2.157-.36.35-.36s.35.16.35.36-.158.36-.35.36-.35-.16-.35-.36zm-5.994 0c0-.2.157-.36.35-.36h3.854c.193 0 .35.16.35.36s-.157.36-.35.36H7.58c-.193 0-.35-.16-.35-.36z"/>
              <path d="M24 14.388c0-3.553-3.244-6.437-7.244-6.437-4.001 0-7.244 2.884-7.244 6.437 0 3.553 3.243 6.437 7.244 6.437.636 0 1.251-.078 1.826-.215.208-.103.461-.078.644.051l1.614.756c.28.13.606-.142.472-.462l-.331-1.102a.508.508 0 0 1 .181-.567c1.544-1.156 2.538-2.86 2.538-4.898zM19.23 13.11c0-.17-.137-.31-.305-.31s-.305.14-.305.31.137.31.305.31.305-.14.305-.31zm-2.135 0c0-.17-.137-.31-.305-.31s-.305.14-.305.31.137.31.305.31.305-.14.305-.31z"/>
            </svg>
          </div>
          
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            微信扫码登录
          </h2>
          <p className="text-gray-600 mb-8">
            使用微信扫描下方二维码快速登录
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              {qrCodeUrl ? (
                <div className="text-center">
                  <Image
                    src={qrCodeUrl}
                    alt="微信登录二维码"
                    width={180}
                    height={180}
                    className="rounded-lg"
                  />
                  <p className="text-xs text-gray-500 mt-2">扫描二维码登录</p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-500">加载中...</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleWeChatLogin}
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.176 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.298c-.115.37.225.696.556.542l1.903-.892c.323-.15.709-.078.985.068 1.038.548 2.224.864 3.422.864 4.8 0 8.691-3.288 8.691-7.342C18.382 5.476 14.491 2.188 9.69 2.188z"/>
              </svg>
              <span>{loading ? '登录中...' : '使用微信登录'}</span>
            </button>

            <div className="text-xs text-gray-500 space-y-1">
              <p>• 首次使用微信登录将自动创建账户</p>
              <p>• 支持微信扫码和手机微信直接打开</p>
              <p>• 登录即表示同意用户协议和隐私政策</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            登录遇到问题？
            <a href="#" className="text-hupu-orange hover:text-orange-600 font-medium ml-1">
              联系客服
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}