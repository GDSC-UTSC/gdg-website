'use client'

import { useAuth } from '@/contexts/AuthContext'
import { getIdToken } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function TokenPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      refreshToken()
    } else {
      router.push('/')
    }
  }, [user, router])

  const refreshToken = async () => {
    if (!user) return

    try {
      await getIdToken(user, true)
      router.push('/')
    } catch (error) {
      console.error('Error refreshing token:', error)
      router.push('/')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Refreshing token...</p>
    </div>
  )
}
