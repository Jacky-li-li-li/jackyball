import NextAuth from 'next-auth'
import { connectToDatabase } from '../../../lib/db'
import User from '../../../lib/models/User'

// 微信OAuth配置
const WeChatProvider = {
  id: 'wechat',
  name: 'WeChat',
  type: 'oauth',
  authorization: {
    url: 'https://open.weixin.qq.com/connect/qrconnect',
    params: {
      appid: process.env.WECHAT_APP_ID,
      redirect_uri: process.env.WECHAT_REDIRECT_URI,
      response_type: 'code',
      scope: 'snsapi_login',
      state: 'wechat_login',
    },
  },
  token: 'https://api.weixin.qq.com/sns/oauth2/access_token',
  userinfo: 'https://api.weixin.qq.com/sns/userinfo',
  clientId: process.env.WECHAT_APP_ID,
  clientSecret: process.env.WECHAT_APP_SECRET,
  profile(profile: any) {
    return {
      id: profile.openid,
      name: profile.nickname,
      email: `${profile.openid}@wechat.com`,
      image: profile.headimgurl,
      openid: profile.openid,
      unionid: profile.unionid,
    }
  },
}

const handler = NextAuth({
  providers: [WeChatProvider as any],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'wechat') {
        try {
          await connectToDatabase()
          
          // 检查用户是否已存在
          const existingUser = await User.findOne({ 
            $or: [
              { wechatOpenId: user.id },
              { email: user.email }
            ]
          })

          if (existingUser) {
            // 更新用户信息
            existingUser.name = user.name || existingUser.name
            existingUser.avatar = user.image || existingUser.avatar
            existingUser.wechatOpenId = user.id
            await existingUser.save()
            return true
          } else {
            // 创建新用户
            await User.create({
              name: user.name || '微信用户',
              email: user.email,
              avatar: user.image || '',
              wechatOpenId: user.id,
              bio: '',
              teams: [],
            })
            return true
          }
        } catch (error) {
          console.error('WeChat sign in error:', error)
          return false
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.openid = (user as any).openid
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        // 从数据库获取完整的用户信息
        try {
          await connectToDatabase()
          const dbUser = await User.findOne({ wechatOpenId: token.id })
          if (dbUser) {
            session.user.id = dbUser._id.toString()
            session.user.name = dbUser.name
            session.user.email = dbUser.email
            session.user.image = dbUser.avatar
          }
        } catch (error) {
          console.error('Session callback error:', error)
        }
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
})

export { handler as GET, handler as POST }