'use client'

import { useParams, useRouter } from 'next/navigation'
import { ChevronLeft, Camera, DollarSign, Image as ImageIcon, Send, X } from 'lucide-react'
import { useState, useRef } from 'react'
import { SetPriceModal } from '@/components/messages/set-price-modal'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'

interface MediaFile {
  id: string
  type: 'image' | 'video'
  url: string
  file: File
  price?: string
}

// Mock message data
const mockMessages = [
  {
    id: '1',
    text: 'Hello! 👋 How are you?',
    isFromMe: false,
    timestamp: '10:30',
  },
  {
    id: '2',
    text: 'I want a refund',
    isFromMe: true,
    timestamp: '10:45',
  },
  {
    id: '3',
    text: 'No refunds, sorry!',
    isFromMe: false,
    timestamp: '11:00',
  },
  {
    id: '4',
    text: 'Definitely not fair, I did not get what I paid for, please can I speak to the manager',
    isFromMe: true,
    timestamp: '11:15',
  },
  {
    id: '5',
    text: 'Sorry, the manager is busy',
    isFromMe: false,
    timestamp: '11:30',
  },
]

// Mock user data
const mockUser = {
  name: 'Hollycanning',
  isVerified: true,
  isOnline: true,
  avatarUrl: null,
}

export default function ChatThreadPage() {
  const params = useParams()
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false)
  const [tempPrice, setTempPrice] = useState('')
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          setMediaFiles((prev) => [
            ...prev,
            {
              id: Math.random().toString(36).substr(2, 9),
              type: 'image',
              url: reader.result as string,
              file,
            },
          ])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeMedia = (id: string) => {
    setMediaFiles((prev) => prev.filter((media) => media.id !== id))
  }

  const handleSetPrice = () => {
    // Apply price to all media files
    if (mediaFiles.length > 0) {
      setMediaFiles((prev) =>
        prev.map((media) => ({
          ...media,
          price: tempPrice,
        }))
      )
    }
  }

  const handleSend = () => {
    if (message.trim() || mediaFiles.length > 0) {
      console.log('Sending message:', message, 'with media:', mediaFiles)
      setMessage('')
      setMediaFiles([])
      setTempPrice('')
    }
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="flex items-center gap-4 px-4 py-3 border-b border-gray-200 bg-white sticky top-0 z-10">
        <Button
          onClick={() => router.back()}
          variant="ghost"
          size="icon"
          className="p-2 -ml-2 rounded-full"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </Button>

        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-blue-400 flex-shrink-0" />
          {mockUser.isOnline && (
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <h2 className="font-semibold text-gray-900 text-lg">
              {mockUser.name}
            </h2>
            {mockUser.isVerified && (
              <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                <circle cx="12" cy="12" r="10" fill="currentColor"/>
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="white"/>
              </svg>
            )}
          </div>
          <p className="text-sm text-gray-500">
            {mockUser.isOnline ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 bg-gray-50">
        {/* Date Divider */}
        <div className="flex justify-center mb-6">
          <span className="text-sm font-semibold text-gray-900">Yesterday</span>
        </div>

        {/* Messages */}
        <div className="space-y-4">
          {mockMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isFromMe ? 'justify-end' : 'justify-start'}`}
            >
              {/* Avatar for received messages */}
              {!msg.isFromMe && (
                <div className="w-10 h-10 rounded-full bg-blue-400 flex-shrink-0 mr-3" />
              )}

              {/* Message Bubble */}
              <div
                className={`max-w-[75%] px-5 py-3 rounded-3xl ${
                  msg.isFromMe
                    ? 'bg-blue-500 text-white rounded-br-md'
                    : 'bg-white text-gray-900 rounded-bl-md'
                }`}
              >
                <p className="text-[15px] leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white p-4 pb-6">
        {/* Media Previews */}
        {mediaFiles.length > 0 && (
          <div className="mb-4">
            <div className="flex gap-3 overflow-x-auto pb-2">
              {mediaFiles.map((media) => (
                <div key={media.id} className="relative flex-shrink-0">
                  <div className="w-32 h-40 bg-blue-300 rounded-2xl overflow-hidden">
                    {media.type === 'image' ? (
                      <img
                        src={media.url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        src={media.url}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  {/* Remove Button */}
                  <Button
                    onClick={() => removeMedia(media.id)}
                    size="icon"
                    className="absolute -top-2 -right-2 w-7 h-7 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg"
                  >
                    <X className="w-4 h-4 text-white" strokeWidth={3} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Message Text Area */}
        {(mediaFiles.length > 0 || message) && (
          <div className="mb-4">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a caption..."
              className="w-full px-4 py-3 bg-gray-50 rounded-2xl border-none focus:outline-none resize-none text-gray-900 placeholder-gray-400 min-h-[80px]"
            />
          </div>
        )}

        {/* Hidden file inputs */}
        <Input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="hidden"
        />
        <Input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          multiple
          onChange={handleImageUpload}
          className="hidden"
        />

        {/* Bottom Action Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Set Price Button */}
            <Button
              onClick={() => {
                if (mediaFiles.length === 0) {
                  alert('Please attach media first')
                  return
                }
                setIsPriceModalOpen(true)
              }}
              variant="secondary"
              className={`flex items-center gap-2 rounded-full ${
                mediaFiles.some((m) => m.price)
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  : ''
              }`}
            >
              <DollarSign className="w-5 h-5" strokeWidth={2.5} />
              <span className="text-sm font-medium">
                {mediaFiles.some((m) => m.price)
                  ? `$${mediaFiles[0]?.price}`
                  : 'Set Price'}
              </span>
            </Button>

            {/* Image Button */}
            <Button
              onClick={() => imageInputRef.current?.click()}
              variant="ghost"
              size="icon"
              className="p-2.5 rounded-full"
            >
              <ImageIcon className="w-6 h-6 text-gray-600" strokeWidth={2} />
            </Button>
          </div>

          {/* Send Button */}
          <Button
            onClick={handleSend}
            disabled={!message.trim() && mediaFiles.length === 0}
            size="icon"
            className="p-3 bg-blue-500 hover:bg-blue-600 rounded-full"
          >
            <Send className="w-5 h-5 text-white" fill="white" strokeWidth={2} />
          </Button>
        </div>
      </div>

      {/* Set Price Modal */}
      <SetPriceModal
        isOpen={isPriceModalOpen}
        onClose={() => setIsPriceModalOpen(false)}
        price={tempPrice}
        onPriceChange={setTempPrice}
        onConfirm={handleSetPrice}
      />
    </div>
  )
}

