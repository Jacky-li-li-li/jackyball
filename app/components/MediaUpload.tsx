'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useSession } from 'next-auth/react'

interface MediaUploadProps {
  teamId?: string
  onUploadComplete?: (media: any) => void
  allowedTypes?: string[]
  multiple?: boolean
}

export default function MediaUpload({ 
  teamId, 
  onUploadComplete, 
  allowedTypes = ['image/*', 'video/*'],
  multiple = true 
}: MediaUploadProps) {
  const { data: session } = useSession()
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [isPublic, setIsPublic] = useState(true)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!session?.user?.id) {
      alert('请先登录')
      return
    }

    setUploading(true)

    for (const file of acceptedFiles) {
      try {
        const formData = new FormData()
        formData.append('file', file)
        if (teamId) formData.append('teamId', teamId)
        formData.append('description', description)
        formData.append('tags', tags)
        formData.append('isPublic', isPublic.toString())

        // Track upload progress
        const xhr = new XMLHttpRequest()
        
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100
            setUploadProgress(prev => ({ ...prev, [file.name]: progress }))
          }
        }

        xhr.onload = () => {
          if (xhr.status === 201) {
            const response = JSON.parse(xhr.responseText)
            onUploadComplete?.(response.media)
            setUploadProgress(prev => {
              const newProgress = { ...prev }
              delete newProgress[file.name]
              return newProgress
            })
          }
        }

        xhr.onerror = () => {
          console.error(`Upload failed for ${file.name}`)
          setUploadProgress(prev => {
            const newProgress = { ...prev }
            delete newProgress[file.name]
            return newProgress
          })
        }

        xhr.open('POST', '/api/upload')
        xhr.send(formData)

      } catch (error) {
        console.error('Upload error:', error)
      }
    }

    setUploading(false)
  }, [session, teamId, description, tags, isPublic, onUploadComplete])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: allowedTypes.reduce((acc, type) => {
      acc[type] = []
      return acc
    }, {} as any),
    multiple,
    maxSize: undefined, // No size limit
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            描述 (可选)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-hupu-orange focus:border-hupu-orange"
            placeholder="描述这个文件..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            标签 (可选)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-hupu-orange focus:border-hupu-orange"
            placeholder="标签1, 标签2, 标签3"
          />
        </div>
      </div>

      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          id="isPublic"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          className="h-4 w-4 text-hupu-orange focus:ring-hupu-orange border-gray-300 rounded"
        />
        <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-900">
          公开文件（其他用户可以查看）
        </label>
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-hupu-orange bg-orange-50'
            : 'border-gray-300 hover:border-hupu-orange hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          
          {isDragActive ? (
            <p className="text-hupu-orange font-medium">释放文件开始上传...</p>
          ) : (
            <div>
              <p className="text-gray-600 mb-2">
                拖拽文件到这里，或点击选择文件
              </p>
              <p className="text-sm text-gray-500">
                支持图片和视频文件，无大小限制
              </p>
            </div>
          )}
        </div>
      </div>

      {Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">上传进度:</h4>
          {Object.entries(uploadProgress).map(([filename, progress]) => (
            <div key={filename} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="truncate">{filename}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-hupu-orange h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {uploading && (
        <div className="text-center text-gray-600">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-hupu-orange inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          正在上传文件...
        </div>
      )}
    </div>
  )
}