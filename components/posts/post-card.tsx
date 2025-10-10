'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Post } from '@/lib/types'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, MessageCircle, Eye } from 'lucide-react'
import { postsApi } from '@/lib/api/posts'
import { formatDistanceToNow } from 'date-fns'

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked || false)
  const [likeCount, setLikeCount] = useState(post.totalLikes)

  const handleLike = async () => {
    try {
      if (isLiked) {
        await postsApi.unlikePost(post.id)
      } else {
        await postsApi.likePost(post.id)
      }
      setIsLiked(!isLiked)
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
    } catch (err) {
      console.error('Failed to toggle like:', err)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Link 
            href={`/creators/${post.creator?.username}`}
            className="flex items-center gap-3"
          >
            <Avatar>
              <AvatarImage src={post.creator?.profilePictureUrl} />
              <AvatarFallback>
                {post.creator?.displayName?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{post.creator?.displayName}</p>
              <p className="text-sm text-muted-foreground">
                @{post.creator?.username}
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            {!post.isPublic && (
              <Badge variant="secondary">Subscribers Only</Badge>
            )}
            <span className="text-sm text-muted-foreground">
              {post.publishedAt && formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {post.content && (
          <p className="text-base mb-4 whitespace-pre-wrap">{post.content}</p>
        )}
        
        {post.mediaUrls && post.mediaUrls.length > 0 && (
          <div className="grid grid-cols-2 gap-2 rounded-lg overflow-hidden">
            {post.mediaUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Post media ${index + 1}`}
                className="w-full h-64 object-cover"
              />
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className={isLiked ? 'text-red-500' : ''}
        >
          <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
          {likeCount}
        </Button>
        
        <Button variant="ghost" size="sm">
          <MessageCircle className="h-4 w-4 mr-1" />
          {post.totalComments}
        </Button>
        
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4 mr-1" />
          {post.totalViews}
        </Button>
      </CardFooter>
    </Card>
  )
}
