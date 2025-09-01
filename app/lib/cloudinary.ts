import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const uploadToCloudinary = async (file: Buffer, options: {
  folder?: string,
  resource_type?: 'image' | 'video' | 'raw' | 'auto',
  public_id?: string,
  transformation?: any[]
}) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: options.folder || 'sports-team-uploads',
      resource_type: options.resource_type || 'auto',
      public_id: options.public_id,
      transformation: options.transformation,
      chunk_size: 6000000, // 6MB chunks for large files
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      }
    )

    uploadStream.end(file)
  })
}

export const deleteFromCloudinary = async (publicId: string, resourceType: 'image' | 'video' | 'raw' = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    })
    return result
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error)
    throw error
  }
}

export default cloudinary