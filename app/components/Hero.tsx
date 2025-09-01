import Link from 'next/link'

export default function Hero() {
  return (
    <div className="hupu-gradient text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center animate-fadeIn">
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
              🏀 体育之家
            </h1>
            <div className="w-24 h-1 bg-white/30 mx-auto rounded-full"></div>
          </div>
          <p className="text-xl md:text-2xl mb-8 text-orange-50 max-w-3xl mx-auto leading-relaxed">
            汇聚最新体育资讯 · 创建专属球队 · 分享精彩瞬间 · 连接运动爱好者
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/news" 
              className="inline-block bg-white text-hupu-orange px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              📰 浏览新闻
            </Link>
            <Link 
              href="/teams/create" 
              className="inline-block bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-hupu-orange transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              ⚽ 创建球队
            </Link>
            <Link 
              href="/upload" 
              className="inline-block bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/20 transition-all duration-200"
            >
              📸 上传媒体
            </Link>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-white/5 rounded-full blur-sm"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-sm"></div>
      <div className="absolute top-1/2 right-1/4 w-6 h-6 bg-white/20 rounded-full"></div>
    </div>
  )
}