'use client'

import { useState, useEffect, use, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { PLAN_CONFIGS } from '@/lib/entitlements'
import {
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  ArrowLeft,
  Loader2,
} from 'lucide-react'

function CheckoutContent({ eventId }: { eventId: string }) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [selectedPlan, setSelectedPlan] = useState<string>(
    searchParams.get('plan') || 'interactive'
  )
  const [event, setEvent] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetchEvent()
  }, [eventId])

  const fetchEvent = async () => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const { data } = await supabase
        .from('events')
        .select('id, title, slug, plan_id')
        .eq('id', eventId)
        .single()

      if (data) setEvent(data)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCheckout = async () => {
    setIsProcessing(true)
    setErrorMessage(null)

    try {
      const supabase = createClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push(`/login?redirect=/dashboard/events/${eventId}/checkout`)
        return
      }

      const planConfig = PLAN_CONFIGS[selectedPlan] || PLAN_CONFIGS.interactive

      // 1. Get plan record in DB
      let { data: dbPlan } = await supabase
        .from('plans')
        .select('id')
        .eq('code', planConfig.code)
        .maybeSingle()

      if (!dbPlan) {
        const { data: firstPlan } = await supabase
          .from('plans')
          .select('id')
          .eq('is_active', true)
          .order('display_order', { ascending: true })
          .limit(1)
          .maybeSingle()
        dbPlan = firstPlan
      }

      if (!dbPlan) {
        setErrorMessage('No se encontró un plan activo disponible.')
        setIsProcessing(false)
        return
      }

      const planDbId = dbPlan.id

      // 2. Create Order in DB
      await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          event_id: eventId,
          plan_id: planDbId,
          amount: planConfig.priceUsd,
          currency: 'USD',
          status: 'completed',
        })
        .select()
        .single()

      // 3. Update Event plan & expiration date
      const expirationDate = new Date()
      expirationDate.setDate(expirationDate.getDate() + planConfig.durationDays)

      await supabase
        .from('events')
        .update({
          plan_id: planDbId,
          expires_at: expirationDate.toISOString(),
          status: 'published',
        })
        .eq('id', eventId)

      setSuccess(true)
      setTimeout(() => {
        router.push(`/dashboard/events/${eventId}/edit`)
      }, 2000)
    } catch {
      setErrorMessage('Error al procesar la activación del plan.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-400" />
      </div>
    )
  }

  const currentPlan = PLAN_CONFIGS[selectedPlan] || PLAN_CONFIGS.interactive

  return (
    <div>
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-white">Activar Plan para tu Evento</h1>
        <p className="text-sm text-slate-400 mt-2">
          Evento: <span className="text-white font-semibold">{event?.title}</span> (/{event?.slug})
        </p>
      </div>

      {success ? (
        <div className="rsd-glow-card p-12 rounded-3xl text-center space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-white">¡Plan Activado con Éxito!</h2>
          <p className="text-sm text-slate-300">
            Tu evento ha sido actualizado al plan <span className="font-bold text-purple-300">{currentPlan.name}</span> y se encuentra publicado en línea.
          </p>
          <p className="text-xs text-slate-500">Redirigiendo a tu invitación...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch mb-8">
          {Object.values(PLAN_CONFIGS).map((plan) => (
            <div
              key={plan.code}
              onClick={() => setSelectedPlan(plan.code)}
              className={`p-6 rounded-2xl cursor-pointer transition-all border flex flex-col justify-between ${
                selectedPlan === plan.code
                  ? 'bg-gradient-to-b from-[#1C1338] to-[#120E24] border-fuchsia-500 shadow-xl shadow-purple-600/20'
                  : 'bg-[#110D23] border-purple-900/30 hover:border-purple-500/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg text-white">{plan.name}</h3>
                  {selectedPlan === plan.code && (
                    <span className="w-5 h-5 rounded-full bg-fuchsia-600 flex items-center justify-center text-white text-xs">
                      ✓
                    </span>
                  )}
                </div>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-extrabold text-white">${plan.priceUsd}</span>
                  <span className="text-xs text-slate-400 ml-1">USD</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  {plan.durationDays} días de vigencia post-evento
                </p>
                <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                    <span>Slug personalizado</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                    <span>{plan.limits.allow_rsvp ? 'Confirmación RSVP incluida' : 'Sin confirmación RSVP'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                    <span>{plan.limits.allow_music ? 'Música ambiental' : 'Sin música'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                    <span>{plan.limits.remove_watermark ? 'Sin marca de agua' : 'Con marca discreta'}</span>
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {!success && (
        <div className="rsd-glow-card p-6 sm:p-8 rounded-2xl border border-purple-900/30 max-w-xl mx-auto text-center space-y-4">
          <div className="flex items-center justify-between text-sm border-b border-purple-900/20 pb-4">
            <span className="text-slate-400">Total a pagar:</span>
            <span className="text-2xl font-extrabold text-white">
              ${currentPlan.priceUsd} USD
            </span>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Transacción cifrada · Modo seguro de activación</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={isProcessing}
            className="w-full rsd-glow-button py-4 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Activando plan...</span>
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                <span>Confirmar y Activar {currentPlan.name}</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default function CheckoutPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)
  const eventId = resolvedParams.id

  return (
    <div className="min-h-screen bg-[#090714] text-[#F8FAFC]">
      <header className="border-b border-purple-900/20 bg-[#0C091C]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href={`/dashboard/events/${eventId}/edit`}
            className="text-slate-400 hover:text-white flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Editor</span>
          </Link>
          <span className="text-xs text-purple-400 font-bold uppercase tracking-wider">
            Activación & Pago
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <Suspense fallback={<Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-400" />}>
          <CheckoutContent eventId={eventId} />
        </Suspense>
      </main>
    </div>
  )
}
