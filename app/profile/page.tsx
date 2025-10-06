'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { useRouter } from 'next/navigation'
import { creatorsApi } from '@/lib/api/creators'
import { subscriptionsApi } from '@/lib/api/subscriptions'
import { CreatorProfile, Subscription } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BottomNav } from '@/components/nav/bottom-nav'
import Link from 'next/link'

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [creatorProfile, setCreatorProfile] = useState<CreatorProfile | null>(null)
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      try {
        setLoading(true)
        
        // Try to get creator profile
        try {
          const profile = await creatorsApi.getMyProfile()
          setCreatorProfile(profile)
        } catch {
          // User is not a creator yet or network error
          setCreatorProfile(null)
        }

        // Get subscriptions
        try {
          const subs = await subscriptionsApi.getMySubscriptions()
          setSubscriptions(subs)
        } catch {
          // Network error or no subscriptions
          setSubscriptions([])
        }
      } catch (err) {
        console.error('Failed to load profile:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  if (authLoading || loading) {
    return (
      <>
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <BottomNav />
      </>
    )
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8 pb-20">
        <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={creatorProfile?.profilePictureUrl} />
                <AvatarFallback className="text-2xl">
                  {user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">
                  {creatorProfile?.displayName || user?.email}
                </h1>
                {creatorProfile && (
                  <p className="text-muted-foreground mb-2">
                    @{creatorProfile.username}
                  </p>
                )}
                <div className="flex gap-2">
                  <Badge>{user?.email}</Badge>
                  {creatorProfile?.isVerified && (
                    <Badge variant="secondary">Verified Creator</Badge>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="creator">Creator</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span>{user?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account Type:</span>
                  <span>{creatorProfile ? 'Creator' : 'Fan'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active Subscriptions:</span>
                  <span>{subscriptions.length}</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="creator" className="space-y-4">
            {creatorProfile ? (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardDescription>Total Posts</CardDescription>
                      <CardTitle className="text-3xl">
                        {creatorProfile.totalPosts}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardDescription>Subscribers</CardDescription>
                      <CardTitle className="text-3xl">
                        {creatorProfile.totalSubscribers}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardDescription>Total Likes</CardDescription>
                      <CardTitle className="text-3xl">
                        {creatorProfile.totalLikes}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardDescription>Total Earnings</CardDescription>
                      <CardTitle className="text-3xl">
                        ${creatorProfile.totalEarnings}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Creator Profile</CardTitle>
                    <CardDescription>
                      Manage your creator settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button>Edit Profile</Button>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Become a Creator</CardTitle>
                  <CardDescription>
                    Start sharing content and earning on Follwr
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/creator/setup">
                    <Button>Set Up Creator Profile</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="subscriptions" className="space-y-4">
            {subscriptions.length > 0 ? (
              subscriptions.map((sub) => (
                <Card key={sub.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={sub.creator?.profilePictureUrl} />
                          <AvatarFallback>
                            {sub.creator?.displayName?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">
                            {sub.creator?.displayName}
                          </CardTitle>
                          <CardDescription>
                            @{sub.creator?.username}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge
                        variant={sub.status === 'active' ? 'default' : 'secondary'}
                      >
                        {sub.status}
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-16 text-center">
                  <p className="text-muted-foreground mb-4">
                    You haven&apos;t subscribed to any creators yet
                  </p>
                  <Link href="/creators">
                    <Button>Discover Creators</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
    <BottomNav />
  </>
  )
}
