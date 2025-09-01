import NewsList from '../components/NewsList'

export const metadata = {
  title: '体育新闻 - 体育之家',
  description: '最新体育新闻资讯',
}

export default function NewsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <NewsList />
    </div>
  )
}