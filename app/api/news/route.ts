import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { connectToDatabase } from '../../lib/db'
import News from '../../lib/models/News'

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase()

    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')

    let query: any = { isPublished: true }

    if (category && category !== 'all') {
      query.category = category
    }

    if (featured === 'true') {
      query.isFeatured = true
    }

    const skip = (page - 1) * limit

    const news = await News.find(query)
      .populate('author', 'name avatar')
      .sort({ isFeatured: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    const total = await News.countDocuments(query)

    return NextResponse.json({
      news,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectToDatabase()

    const { title, content, summary, category, tags, featuredImage, isFeatured } = await req.json()

    if (!title || !content || !summary || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const news = await News.create({
      title,
      content,
      summary,
      category,
      tags: tags || [],
      featuredImage: featuredImage || '',
      isFeatured: isFeatured || false,
      author: session.user.id,
    })

    await news.populate('author', 'name avatar')

    return NextResponse.json(
      { message: 'News created successfully', news },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating news:', error)
    return NextResponse.json(
      { error: 'Failed to create news' },
      { status: 500 }
    )
  }
}