'use client'

import { useEffect, useState, useRef } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Upload, X } from 'lucide-react'
import { PrimaryButton } from '@/components/ui/primary-button'
import Image from 'next/image'

interface ProductFile {
  id: string
  name: string
  size: number
  file: File
}

export default function CreateProductPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [productName, setProductName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [productImage, setProductImage] = useState<string | null>(null)
  const [productFiles, setProductFiles] = useState<ProductFile[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const imageInputRef = useRef<HTMLInputElement>(null)
  const filesInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProductImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFilesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newFiles: ProductFile[] = Array.from(files).map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        file,
      }))
      setProductFiles((prev) => [...prev, ...newFiles])
    }
  }

  const removeFile = (id: string) => {
    setProductFiles((prev) => prev.filter((file) => file.id !== id))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const handleSubmit = async () => {
    if (!productName.trim()) {
      alert('Please enter a product name')
      return
    }
    if (!price || parseFloat(price) <= 0) {
      alert('Please enter a valid price')
      return
    }
    if (productFiles.length === 0) {
      alert('Please upload at least one file')
      return
    }

    setIsSubmitting(true)
    // TODO: API call to create product
    console.log('Creating product:', {
      productName,
      description,
      price,
      productImage,
      files: productFiles.length,
    })
    
    setTimeout(() => {
      setIsSubmitting(false)
      router.push('/feed')
    }, 1000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-center px-4 py-4 border-b border-gray-200 relative">
        <button
          onClick={() => router.back()}
          className="absolute left-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
        
        <h1 className="text-xl font-semibold text-gray-900">
          Add product
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="px-6 pt-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Downloadable products, image packages, videos, etc
          </h2>

          {/* Product Picture */}
          <div className="mb-4">
            <div className="flex items-start gap-4">
              <div
                onClick={() => imageInputRef.current?.click()}
                className="w-32 h-32 rounded-2xl bg-blue-100 flex items-center justify-center cursor-pointer hover:bg-blue-200 transition-colors overflow-hidden flex-shrink-0"
              >
                {productImage ? (
                  <img src={productImage} alt="Product" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-base font-medium text-gray-900 mb-0.5">
                  Product picture
                </h3>
                <p className="text-xs text-gray-500 mb-2">
                  Jpg, png, svg
                </p>
                <button
                  onClick={() => imageInputRef.current?.click()}
                  className="px-4 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-full transition-colors"
                >
                  Upload
                </button>
              </div>
            </div>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Product Name */}
          <div className="mb-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-4">
              <label className="block text-xs text-gray-500 mb-1.5">
                Product name
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="My fitness Program"
                className="w-full text-base text-gray-900 placeholder-gray-400 border-none outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-4">
              <label className="block text-xs text-gray-500 mb-1.5">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ready to transform your body and mindset? This program is built to help you get stronger, leaner, and more energized — without the guesswork."
                rows={5}
                className="w-full text-sm text-gray-900 placeholder-gray-400 border-none outline-none bg-transparent resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Price */}
          <div className="mb-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-3">
              <div className="text-3xl text-blue-400 font-light">$</div>
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-0.5">
                  Price
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="5"
                  className="w-full text-xl text-gray-900 placeholder-gray-400 border-none outline-none bg-transparent"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          {/* Upload Files */}
          <div className="mb-4">
            <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-6">
              {productFiles.length > 0 ? (
                <div className="space-y-2 mb-3">
                  {productFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFile(file.id)}
                        className="ml-3 p-1 hover:bg-gray-200 rounded-full transition-colors"
                      >
                        <X className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center py-4">
                  <div className="w-24 h-24 mb-3">
                    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="40" y="80" width="120" height="80" rx="12" fill="#BFDBFE" />
                      <rect x="50" y="90" width="100" height="4" rx="2" fill="white" />
                      <rect x="50" y="100" width="80" height="4" rx="2" fill="white" />
                      <rect x="50" y="110" width="90" height="4" rx="2" fill="white" />
                      <rect x="50" y="120" width="70" height="4" rx="2" fill="white" />
                      <path d="M100 40L120 60H80L100 40Z" fill="#BFDBFE" />
                      <rect x="95" y="60" width="10" height="20" fill="#BFDBFE" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-2">
                    Upload files here
                  </p>
                </div>
              )}
              <button
                onClick={() => filesInputRef.current?.click()}
                className="w-full px-5 py-2.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-full transition-colors"
              >
                Upload
              </button>
            </div>
            <input
              ref={filesInputRef}
              type="file"
              multiple
              onChange={handleFilesUpload}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
        <PrimaryButton
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full text-base py-3.5"
        >
          {isSubmitting ? 'Adding product...' : 'Add product'}
        </PrimaryButton>
      </div>
    </div>
  )
}

