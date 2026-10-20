'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LogOut, Loader2 } from 'lucide-react'

interface SignOutButtonProps {
  className?: string
  variant?: 'navbar' | 'sidebar' | 'dashboard'
}

export function SignOutButton({ className, variant = 'navbar' }: SignOutButtonProps) {
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/')
      router.refresh()
    } catch {
      router.push('/login')
    } finally {
      setIsSigningOut(false)
    }
  }

  if (variant === 'sidebar') {
    return (
      <button
        onClick={handleSignOut}
        disabled={isSigningOut}
        className={
          className ||
          'w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-semibold transition-colors disabled:opacity-50'
        }
      >
        {isSigningOut ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <LogOut className="w-3.5 h-3.5" />
        )}
        <span>Cerrar Sesión</span>
      </button>
    )
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={isSigningOut}
      className={
        className ||
        'text-xs font-semibold text-rose-300 hover:text-rose-200 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all flex items-center gap-1.5 disabled:opacity-50'
      }
      title="Cerrar sesión"
    >
      {isSigningOut ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : (
        <LogOut className="w-3 h-3" />
      )}
      <span>Cerrar Sesión</span>
    </button>
  )
}
