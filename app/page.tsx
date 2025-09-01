import NewsList from './components/NewsList'
import Hero from './components/Hero'
import FeaturedTeams from './components/FeaturedTeams'

export default function Home() {
  return (
    <div className="space-y-8">
      <Hero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <NewsList />
          </div>
          <div className="lg:col-span-1">
            <FeaturedTeams />
          </div>
        </div>
      </div>
    </div>
  )
}