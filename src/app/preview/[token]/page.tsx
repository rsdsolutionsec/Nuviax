import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { TemplateRenderer } from '@/templates/TemplateRenderer'
import {
  ShieldAlert,
  Clock,
  Eye,
  AlertCircle,
} from 'lucide-react'

interface PreviewProps {
  params: Promise<{ token: string }>
}

export async function generateMetadata({ params }: PreviewProps): Promise<Metadata> {
  const { token } = await params
  return {
    title: 'Demo Privada | Nuviax',
    description: 'Vista previa privada de invitación en borrador.',
    robots: {
      index: false,
      follow: false,
    },
  }
}

export default async function PrivatePreviewPage({ params }: PreviewProps) {
  const { token } = await params
  const supabase = createAdminClient()

  // 1. Fetch event by demo_token including templates and plans
  const { data: event, error } = await supabase
    .from('events')
    .select('*, profiles(full_name, email), templates(*), plans(*)')
    .eq('demo_token', token)
    .maybeSingle()

  if (error || !event) {
    return (
      <div className="min-h-screen bg-[#090714] text-[#F8FAFC] flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full rsd-glow-card p-10 rounded-3xl space-y-4">
          <div className="w-14 h-14 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white">Enlace de Demo Inválido</h1>
          <p className="text-sm text-slate-400">
            El enlace de demostración privada que intentas abrir no existe o ha sido revocado por el anfitrión.
          </p>
        </div>
      </div>
    )
  }

  // 2. Check if revoked
  if (event.demo_revoked) {
    return (
      <div className="min-h-screen bg-[#090714] text-[#F8FAFC] flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full rsd-glow-card p-10 rounded-3xl space-y-4">
          <div className="w-14 h-14 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white">Demostración Revocada</h1>
          <p className="text-sm text-slate-400">
            El anfitrión ha revocado el acceso a este enlace privado de demostración.
          </p>
        </div>
      </div>
    )
  }

  // 3. Check expiration
  if (event.demo_expires_at && new Date(event.demo_expires_at) < new Date()) {
    return (
      <div className="min-h-screen bg-[#090714] text-[#F8FAFC] flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full rsd-glow-card p-10 rounded-3xl space-y-4">
          <div className="w-14 h-14 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white">Demostración Vencida</h1>
          <p className="text-sm text-slate-400">
            El período de validez de esta vista previa privada ha expirado.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* PERSISTENT DEMO BANNER */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-purple-900/90 via-fuchsia-900/90 to-purple-900/90 backdrop-blur-md border-b border-purple-500/30 px-4 py-2.5 text-center shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-purple-200">
            <Eye className="w-4 h-4 text-pink-400 flex-shrink-0" />
            <span className="font-semibold">
              VISTA PREVIA PRIVADA (BORRADOR) — Modo Solo Lectura
            </span>
          </div>
          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-black/40 text-[10px] text-amber-300 font-mono">
            No indexable · RSVP Simulado
          </span>
        </div>
      </div>

      {/* RENDER MODULAR TEMPLATE */}
      <TemplateRenderer
        event={event}
        isDemo={true}
        isReadOnly={true}
      />
    </div>
  )
}
