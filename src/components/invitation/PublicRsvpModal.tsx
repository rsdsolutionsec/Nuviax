'use client'

import { useState } from 'react'
import confetti from 'canvas-confetti'
import { Check, X, Users, AlertCircle, Loader2, Sparkles } from 'lucide-react'

interface PublicRsvpModalProps {
  eventSlug: string
  eventTitle: string
  maxCompanions?: number
  askDietary?: boolean
  invitationToken?: string
  initialGuestName?: string
}

export function PublicRsvpModal({
  eventSlug,
  eventTitle,
  maxCompanions = 2,
  askDietary = true,
  invitationToken,
  initialGuestName = '',
}: PublicRsvpModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [fullName, setFullName] = useState(initialGuestName)
  const [rsvpStatus, setRsvpStatus] = useState<'confirmed' | 'declined'>('confirmed')
  const [companions, setCompanions] = useState(0)
  const [dietary, setDietary] = useState('')
  const [notes, setNotes] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: invitationToken,
          slug: eventSlug,
          fullName,
          rsvpStatus,
          companions: rsvpStatus === 'confirmed' ? companions : 0,
          dietaryRestrictions: dietary,
          notes,
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        setErrorMessage(result.error || 'No se pudo guardar tu confirmación.')
        return
      }

      setIsSuccess(true)

      // Trigger celebratory confetti if confirmed!
      if (rsvpStatus === 'confirmed') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#EC4899', '#7C3AED', '#D4AF37'],
        })
      }
    } catch {
      setErrorMessage('Ocurrió un error de red. Intenta nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full sm:w-auto rsd-glow-button text-white font-extrabold px-8 py-4 rounded-2xl text-base shadow-xl flex items-center justify-center gap-2.5 mx-auto"
      >
        <Sparkles className="w-5 h-5 text-yellow-300" />
        <span>Confirmar Mi Asistencia</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#110D24] border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>

            {isSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  {rsvpStatus === 'confirmed' ? '¡Confirmación Recibida!' : 'Gracias por avisarnos'}
                </h3>
                <p className="text-sm text-slate-300">
                  {rsvpStatus === 'confirmed'
                    ? `Nos alegra contar con tu presencia en "${eventTitle}". ¡Será una celebración inolvidable!`
                    : `Lamentamos que no puedas acompañarnos en esta ocasión. ¡Muchas gracias por tu respuesta!`}
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="rsd-glow-button px-6 py-2.5 rounded-xl text-white text-sm font-semibold"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
                  Confirmación de Asistencia
                </h3>
                <p className="text-xs text-purple-300 mb-6">
                  {eventTitle}
                </p>

                {errorMessage && (
                  <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Attendance choice buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRsvpStatus('confirmed')}
                      className={`p-3 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                        rsvpStatus === 'confirmed'
                          ? 'bg-purple-600/30 border-purple-500 text-white shadow-lg shadow-purple-600/20'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>¡Sí, asistiré!</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRsvpStatus('declined')}
                      className={`p-3 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                        rsvpStatus === 'declined'
                          ? 'bg-rose-600/20 border-rose-500 text-white'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      <X className="w-4 h-4 text-rose-400" />
                      <span>No podré asistir</span>
                    </button>
                  </div>

                  {/* Name field */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Nombre y Apellido
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Tu nombre completo"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#090714] border border-purple-900/30 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  {/* Companions field (only if confirmed) */}
                  {rsvpStatus === 'confirmed' && maxCompanions > 0 && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                        Acompañantes adicionales confirmados
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          min="0"
                          max={maxCompanions}
                          value={companions}
                          onChange={(e) => setCompanions(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-24 px-4 py-2.5 rounded-xl bg-[#090714] border border-purple-900/30 text-white text-sm focus:outline-none focus:border-purple-500 text-center font-bold"
                        />
                        <span className="text-xs text-slate-400">
                          (Máximo {maxCompanions} autorizados)
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Dietary restrictions (only if confirmed and enabled) */}
                  {rsvpStatus === 'confirmed' && askDietary && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                        Restricciones o alergias alimentarias (Opcional)
                      </label>
                      <input
                        type="text"
                        value={dietary}
                        onChange={(e) => setDietary(e.target.value)}
                        placeholder="Ej: Vegetariano, celíaco, alergia a mariscos"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#090714] border border-purple-900/30 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  )}

                  {/* Message / Notes */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Dedicatoria para los anfitriones (Opcional)
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Déjales un mensaje de felicitación..."
                      className="w-full px-4 py-2 rounded-xl bg-[#090714] border border-purple-900/30 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rsd-glow-button py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Enviando confirmación...</span>
                      </>
                    ) : (
                      <span>Confirmar Respuesta</span>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
