import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { connectToDatabase } from '../../lib/db'
import { uploadToCloudinary } from '../../lib/cloudinary'
import Media from '../../lib/models/Media'

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

    const formData = await req.formData()
    const file = formData.get('file') as File
    const teamId = formData.get('teamId') as string
    const description = formData.get('description') as string || ''
    const tags = formData.get('tags') as string
    const isPublic = formData.get('isPublic') === 'true'

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Determine file type
    const isVideo = file.type.startsWith('video/')
    const isImage = file.type.startsWith('image/')

    if (!isVideo && !isImage) {
      return NextResponse.json(
        { error: 'Only image and video files are supported' },
        { status: 400 }
      )
    }

    // Upload to Cloudinary
    const resourceType = isVideo ? 'video' : 'image'
    const folder = teamId ? `teams/${teamId}` : `users/${session.user.id}`

    const uploadResult = await uploadToCloudinary(buffer, {
      folder,
      resource_type: resourceType,
      transformation: isVideo ? [] : [
        { width: 1920, height: 1080, crop: 'limit', quality: 'auto:good' },
        { format: 'auto' }
      ]
    }) as any

    // Save media record to database
    const media = await Media.create({
      filename: uploadResult.public_id,
      originalName: file.name,
      mimetype: file.type,
      size: file.size,
      url: uploadResult.secure_url,
      cloudinaryId: uploadResult.public_id,
      uploadedBy: session.user.id,
      team: teamId || null,
      type: isVideo ? 'video' : 'image',
      description,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      isPublic,
    })

    await media.populate('uploadedBy', 'name avatar')

    return NextResponse.json(
      { 
        message: 'File uploaded successfully',
        media: {
          _id: media._id,
          url: media.url,
          type: media.type,
          originalName: media.originalName,
          size: media.size,
          description: media.description,
          tags: media.tags,
          uploadedBy: media.uploadedBy,
          createdAt: media.createdAt,
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}