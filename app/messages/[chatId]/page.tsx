'use client'

import { useParams, useRouter } from 'next/navigation'
import { ChevronLeft, Camera, DollarSign, Image as ImageIcon, Send, X, MessageCircle } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { SetPriceModal } from '@/components/messages/set-price-modal'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { messagesApi, Message } from '@/lib/api/messages'
import { creatorsApi } from '@/lib/api/creators'
import { uploadApi } from '@/lib/api/upload'

interface MediaFile {
  id: string
  type: 'image' | 'video'
  url: string
  file: File
  price?: string
}

interface PartnerProfile {
  userId: string
  displayName: string
  username: string
  profilePictureUrl?: string
  isVerified: boolean
}

export default function ChatThreadPage() {
  const params = useParams()
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const chatId = params.chatId as string // This is the userId of the chat partner
  
  const [message, setMessage] = useState('')
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false)
  const [tempPrice, setTempPrice] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [partner, setPartner] = useState<PartnerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const loadDataRef = useRef<(() => Promise<void>) | null>(null)
  const refreshMessagesRef = useRef<(() => Promise<void>) | null>(null)
  const loadingRequestRef = useRef<string | null>(null)

  // Create loadData function for initial load
  const loadData = async () => {
    try {
      setLoading(true)
      
      // Load partner profile - try to get creator profile first
      try {
        const creatorProfile = await creatorsApi.getByUserId(chatId)
        setPartner({
          userId: creatorProfile.userId,
          displayName: creatorProfile.displayName || creatorProfile.userProfile?.displayName || creatorProfile.username || creatorProfile.userProfile?.username || 'User',
          username: creatorProfile.username || creatorProfile.userProfile?.username || 'user',
          profilePictureUrl: creatorProfile.profilePictureUrl || creatorProfile.userProfile?.profilePictureUrl,
          isVerified: creatorProfile.isVerified || false,
        })
      } catch (error) {
        // If not a creator, set basic profile
        setPartner({
          userId: chatId,
          displayName: 'User',
          username: 'user',
          isVerified: false,
        })
      }

      // Load messages
      const messagesData = await messagesApi.getMessages(chatId)
      setMessages(messagesData)
    } catch (error) {
      console.error('Failed to load chat data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Create refreshMessages function for reloading messages only (no loading state)
  const refreshMessages = async () => {
    try {
      const messagesData = await messagesApi.getMessages(chatId)
      setMessages(messagesData)
    } catch (error) {
      console.error('Failed to refresh messages:', error)
    }
  }

  // Store functions in refs
  loadDataRef.current = loadData
  refreshMessagesRef.current = refreshMessages

  // Load messages and partner profile
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
      return
    }

    if (!authLoading && user && chatId) {
      // Prevent duplicate loads for the same chatId
      if (loadingRequestRef.current === chatId) return
      loadingRequestRef.current = chatId
      
      loadDataRef.current?.()
    }
  }, [authLoading, user, chatId, router])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          const isVideo = file.type.startsWith('video/')
          setMediaFiles((prev) => [
            ...prev,
            {
              id: Math.random().toString(36).substr(2, 9),
              type: isVideo ? 'video' : 'image',
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
      setIsPriceModalOpen(false)
    }
  }

  const handleSend = async () => {
    if ((!message.trim() && mediaFiles.length === 0) || sending) return

    try {
      setSending(true)
      
      // Upload media files if any
      let uploadedUrls: string[] = []
      if (mediaFiles.length > 0) {
        const uploadPromises = mediaFiles.map(media => 
          uploadApi.uploadFileComplete(media.file)
        )
        uploadedUrls = await Promise.all(uploadPromises)
      }

      // Send message
      const price = mediaFiles.length > 0 && tempPrice ? parseFloat(tempPrice) : undefined
      await messagesApi.sendMessage({
        recipientId: chatId,
        content: message.trim() || undefined,
        mediaUrls: uploadedUrls.length > 0 ? uploadedUrls : undefined,
        price,
      })

      // Clear form
      setMessage('')
      setMediaFiles([])
      setTempPrice('')

      // Refresh messages (without showing loading screen)
      await refreshMessagesRef.current?.()
    } catch (error: any) {
      console.error('Failed to send message:', error)
      alert(error.response?.data?.message || 'Failed to send message. Please try again.')
    } finally {
      setSending(false)
    }
  }

  const formatMessageTime = (date: string) => {
    const d = new Date(date)
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  }

  const formatMessageDate = (date: string) => {
    const d = new Date(date)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (d.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (d.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }
  }

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!partner) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">User not found</p>
      </div>
    )
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
          {partner.profilePictureUrl ? (
            <img 
              src={partner.profilePictureUrl} 
              alt={partner.displayName}
              className="w-12 h-12 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-blue-400 flex-shrink-0" />
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <h2 className="font-semibold text-gray-900 text-lg">
              {partner.displayName}
            </h2>
            {partner.isVerified && (
              <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                <circle cx="12" cy="12" r="10" fill="currentColor"/>
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="white"/>
              </svg>
            )}
          </div>
          <p className="text-sm text-gray-500">
            @{partner.username}
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageCircle className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500">No messages yet</p>
            <p className="text-gray-400 text-sm mt-2">Start the conversation!</p>
          </div>
        ) : (
          <>
            {/* Date Divider - show date of first message */}
            {messages.length > 0 && (
              <div className="flex justify-center mb-6">
                <span className="text-sm font-semibold text-gray-900">
                  {formatMessageDate(messages[0].createdAt)}
                </span>
              </div>
            )}

            {/* Messages */}
            <div className="space-y-4">
              {messages.map((msg) => {
                const isFromMe = msg.senderId === user?.id
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isFromMe ? 'justify-end' : 'justify-start'}`}
                  >
                    {/* Avatar for received messages */}
                    {!isFromMe && (
                      <div className="w-10 h-10 rounded-full bg-blue-400 flex-shrink-0 mr-3 overflow-hidden">
                        {partner.profilePictureUrl ? (
                          <img 
                            src={partner.profilePictureUrl} 
                            alt={partner.displayName}
                            className="w-full h-full object-cover"
                          />
                        ) : null}
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div className="flex flex-col max-w-[75%]">
                      {/* Media */}
                      {msg.mediaUrls && msg.mediaUrls.length > 0 && (
                        <div className="mb-2 space-y-2">
                          {msg.mediaUrls.map((url, idx) => {
                            const isVideo = url.includes('.mp4') || url.includes('.mov') || url.includes('.webm')
                            return (
                              <div key={idx} className="rounded-2xl overflow-hidden max-w-xs">
                                {isVideo ? (
                                  <video src={url} controls className="w-full" />
                                ) : (
                                  <img src={url} alt="Message media" className="w-full" />
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )}
                      
                      {/* Text Content */}
                      {msg.content && (
                        <div
                          className={`px-5 py-3 rounded-3xl ${
                            isFromMe
                              ? 'bg-blue-500 text-white rounded-br-md'
                              : 'bg-white text-gray-900 rounded-bl-md'
                          }`}
                        >
                          <p className="text-[15px] leading-relaxed">{msg.content}</p>
                        </div>
                      )}

                      {/* Price indicator */}
                      {msg.price && msg.price > 0 && (
                        <div className="text-xs text-gray-500 mt-1 px-2">
                          💰 ${msg.price}
                        </div>
                      )}

                      {/* Timestamp */}
                      <div className={`text-xs text-gray-400 mt-1 px-2 ${isFromMe ? 'text-right' : 'text-left'}`}>
                        {formatMessageTime(msg.createdAt)}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
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
        <div className="mb-4">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={mediaFiles.length > 0 ? "Add a caption..." : "Type a message..."}
            className="w-full px-4 py-3 bg-gray-50 rounded-2xl border-none focus:outline-none resize-none text-gray-900 placeholder-gray-400 min-h-[80px]"
          />
        </div>

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
            disabled={(!message.trim() && mediaFiles.length === 0) || sending}
            size="icon"
            className="p-3 bg-blue-500 hover:bg-blue-600 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <Send className="w-5 h-5 text-white" fill="white" strokeWidth={2} />
            )}
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

