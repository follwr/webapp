'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/auth-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Heart, Users, TrendingUp, Shield } from 'lucide-react'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push('/feed')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto mb-20">
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Welcome to Follwr
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          The modern platform where creators connect with their biggest fans.
          Share exclusive content, build your community, and monetize your creativity.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/auth/signup">
            <Button size="lg" className="text-lg">
              Get Started
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button size="lg" variant="outline" className="text-lg">
              Sign In
            </Button>
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        <Card>
          <CardHeader>
            <Heart className="h-10 w-10 text-primary mb-2" />
            <CardTitle>Connect</CardTitle>
            <CardDescription>
              Build deeper relationships with your most dedicated fans
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Users className="h-10 w-10 text-primary mb-2" />
            <CardTitle>Community</CardTitle>
            <CardDescription>
              Create exclusive communities around your content
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <TrendingUp className="h-10 w-10 text-primary mb-2" />
            <CardTitle>Monetize</CardTitle>
            <CardDescription>
              Turn your passion into a sustainable income
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Shield className="h-10 w-10 text-primary mb-2" />
            <CardTitle>Secure</CardTitle>
            <CardDescription>
              Your content and earnings are protected and private
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* CTA Section */}
      <div className="bg-primary/5 rounded-lg p-12 text-center">
        <h2 className="text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
        <p className="text-lg text-muted-foreground mb-6">
          Join thousands of creators already earning on Follwr
        </p>
        <Link href="/auth/signup">
          <Button size="lg">
            Create Your Account
          </Button>
        </Link>
      </div>
    </div>
  )
}