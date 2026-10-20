'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Sparkles, Mail, Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams.get('redirect')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Nuviax'

  // If already authenticated, redirect immediately
  useEffect(() => {
    async function checkExistingAuth() {
      try {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .in('role', ['admin', 'advisor'])
            .maybeSingle()

          const isAdmin = !!roleData
          if (redirectPath) {
            router.replace(redirectPath)
          } else if (isAdmin) {
            router.replace('/admin')
          } else {
            router.replace('/dashboard')
          }
          return
        }
      } catch {
        // Proceed with normal login form
      } finally {
        setIsCheckingSession(false)
      }
    }

    checkExistingAuth()
  }, [router, redirectPath])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setErrorMessage(
          error.message === 'Invalid login credentials'
            ? 'Credenciales incorrectas. Por favor verifica tu correo y contraseña.'
            : error.message
        )
        return
      }

      if (data.user) {
        // Check role to route correctly
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id)
          .in('role', ['admin', 'advisor'])
          .maybeSingle()

        const isAdmin = !!roleData
        if (redirectPath) {
          router.push(redirectPath)
        } else if (isAdmin) {
          router.push('/admin')
        } else {
          router.push('/dashboard')
        }
        router.refresh()
      }
    } catch {
      setErrorMessage('Ocurrió un error inesperado al intentar iniciar sesión.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isCheckingSession) {
    return (
      <div className="w-full max-w-md text-center py-12">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-400 mb-3" />
        <p className="text-xs text-slate-400">Comprobando sesión activa...</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md relative z-10">
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2 group mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-fuchsia-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-600/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-2xl text-white tracking-tight">
            {appName}
          </span>
        </Link>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Acceso a tu Panel
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Administra tus invitaciones, invitados y confirmaciones
        </p>
      </div>

      <div className="rsd-glow-card p-8 rounded-2xl shadow-2xl">
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Correo Electrónico
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#090714]/80 border border-purple-900/30 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Contraseña
              </label>
              <Link
                href="/reset-password"
                className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
              >
                ¿La olvidaste?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#090714]/80 border border-purple-900/30 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rsd-glow-button py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Iniciando sesión...</span>
              </>
            ) : (
              <>
                <span>Ingresar a mi cuenta</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-purple-900/20 text-center">
          <p className="text-xs text-slate-400">
            ¿No tienes una cuenta aún?{' '}
            <Link
              href="/register"
              className="text-pink-400 hover:text-pink-300 font-semibold"
            >
              Regístrate gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#090714] px-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
      <Suspense fallback={<Loader2 className="w-8 h-8 animate-spin text-purple-400" />}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
