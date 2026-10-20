'use client'

import { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'
import {
  Check,
  X,
  Users,
  AlertCircle,
  Loader2,
  Sparkles,
  Phone,
  User,
  HeartHandshake,
  CheckCircle2,
  Info,
} from 'lucide-react'

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
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [rsvpStatus, setRsvpStatus] = useState<'confirmed' | 'declined'>('confirmed')
  const [companions, setCompanions] = useState(0)
  const [dietary, setDietary] = useState('')
  const [notes, setNotes] = useState('')
  const [honeypot, setHoneypot] = useState('') // Anti-bot trap

  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [hasPreviousSubmission, setHasPreviousSubmission] = useState(false)

  // Split initial guest name if provided via props
  useEffect(() => {
    if (initialGuestName) {
      const parts = initialGuestName.trim().split(' ')
      setFirstName(parts[0] || '')
      setLastName(parts.slice(1).join(' ') || '')
    }
  }, [initialGuestName])

  // Check localStorage for previous submission on this event to prevent duplicates & pre-fill
  useEffect(() => {
    try {
      const storageKey = `nuviax_rsvp_${eventSlug}`
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.firstName) setFirstName(parsed.firstName)
        if (parsed.lastName) setLastName(parsed.lastName)
        if (parsed.phone) setPhone(parsed.phone)
        if (parsed.rsvpStatus) setRsvpStatus(parsed.rsvpStatus)
        setHasPreviousSubmission(true)
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [eventSlug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage(null)

    // Basic frontend validations
    if (!firstName.trim() || firstName.trim().length < 2) {
      setErrorMessage('Por favor ingresa tu nombre (mínimo 2 caracteres).')
      setIsLoading(false)
      return
    }

    if (!lastName.trim() || lastName.trim().length < 2) {
      setErrorMessage('Por favor ingresa tu apellido.')
      setIsLoading(false)
      return
    }

    const cleanPhone = phone.replace(/[^0-9+]/g, '')
    if (!cleanPhone || cleanPhone.length < 6) {
      setErrorMessage('Por favor ingresa un número de teléfono válido (mínimo 6 dígitos).')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: invitationToken,
          slug: eventSlug,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: cleanPhone,
          rsvpStatus,
          companions: rsvpStatus === 'confirmed' ? companions : 0,
          dietaryRestrictions: dietary.trim() || null,
          notes: notes.trim() || null,
          botHoneypot: honeypot,
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        setErrorMessage(result.error || 'No se pudo guardar tu confirmación.')
        return
      }

      // Persist in localStorage to prevent spam / accidental re-submissions
      try {
        const storageKey = `nuviax_rsvp_${eventSlug}`
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            phone: cleanPhone,
            rsvpStatus,
            timestamp: new Date().toISOString(),
          })
        )
        setHasPreviousSubmission(true)
      } catch {
        // Ignore localStorage error
      }

      setSuccessMessage(result.message || 'Confirmación registrada con éxito.')
      setIsSuccess(true)

      // Trigger celebratory confetti if confirmed!
      if (rsvpStatus === 'confirmed') {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#EC4899', '#7C3AED', '#D4AF37', '#10B981'],
        })
      }
    } catch {
      setErrorMessage('Ocurrió un error de conexión al enviar tu confirmación.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full sm:w-auto rsd-glow-button text-white font-extrabold px-8 py-4 rounded-2xl text-base shadow-2xl flex items-center justify-center gap-2.5 mx-auto hover:scale-105 transition-all"
      >
        <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
        <span>{hasPreviousSubmission ? 'Ver / Modificar Asistencia' : 'Confirmar Mi Asistencia'}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-lg bg-[#110D24] border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>

            {isSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  {rsvpStatus === 'confirmed' ? '¡Confirmación Registrada!' : 'Gracias por tu respuesta'}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {rsvpStatus === 'confirmed'
                    ? `Nos alegra contar contigo, ${firstName}. Tu respuesta ha sido enviada a los anfitriones de "${eventTitle}".`
                    : `Lamentamos que no puedas acompañarnos, ${firstName}. ¡Muchas gracias por avisarnos con anticipación!`}
                </p>
                <div className="p-3.5 rounded-xl bg-purple-950/50 border border-purple-800/40 text-xs text-purple-300 text-left space-y-1">
                  <p>
                    <strong className="text-white">Invitado:</strong> {firstName} {lastName}
                  </p>
                  <p>
                    <strong className="text-white">Teléfono registrado:</strong> {phone}
                  </p>
                  {rsvpStatus === 'confirmed' && (
                    <p>
                      <strong className="text-white">Acompañantes adicionales:</strong> {companions}
                    </p>
                  )}
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setIsSuccess(false)
                      setIsOpen(false)
                    }}
                    className="rsd-glow-button px-6 py-2.5 rounded-xl text-white text-sm font-semibold"
                  >
                    Entendido / Cerrar
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold">
                    RSVP Oficial
                  </span>
                  <span className="w-1 h-1 rounded-full bg-slate-600" />
                  <span className="text-[10px] text-pink-400 font-bold uppercase tracking-widest">
                    Pase de Asistencia
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
                  Confirmación de Asistencia
                </h3>
                <p className="text-xs text-purple-300/90 mb-5">
                  {eventTitle}
                </p>

                {hasPreviousSubmission && (
                  <div className="mb-5 p-3 rounded-xl bg-purple-900/30 border border-purple-700/40 text-purple-200 text-xs flex items-center gap-2.5">
                    <Info className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Ya registraste tu asistencia anteriormente. Si cambias de planes o deseas actualizar tus datos, puedes guardar los cambios aquí.</span>
                  </div>
                )}

                {errorMessage && (
                  <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Honeypot field (hidden from real users, traps bots) */}
                  <input
                    type="text"
                    name="website_hp"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    style={{ display: 'none' }}
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  {/* Attendance choice buttons */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
                      ¿Podrás asistir a la celebración?
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setRsvpStatus('confirmed')}
                        className={`p-3 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                          rsvpStatus === 'confirmed'
                            ? 'bg-emerald-600/25 border-emerald-500 text-white shadow-lg shadow-emerald-600/20'
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
                            ? 'bg-rose-600/25 border-rose-500 text-white shadow-lg shadow-rose-600/20'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        <X className="w-4 h-4 text-rose-400" />
                        <span>No podré asistir</span>
                      </button>
                    </div>
                  </div>

                  {/* Name and Last Name inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                        Nombre <span className="text-pink-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Ej: Carolina"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#090714] border border-purple-900/30 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                        Apellido <span className="text-pink-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Ej: Mendoza"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#090714] border border-purple-900/30 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  {/* Phone input */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1 flex items-center justify-between">
                      <span>Teléfono / WhatsApp <span className="text-pink-400">*</span></span>
                      <span className="text-[10px] text-slate-500 font-normal lowercase">Para coordinar detalles de acceso</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Ej: +593 99 123 4567"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#090714] border border-purple-900/30 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  {/* Companions field (only if attending) */}
                  {rsvpStatus === 'confirmed' && maxCompanions > 0 && (
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                        Acompañantes adicionales confirmados
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          min="0"
                          max={maxCompanions}
                          value={companions}
                          onChange={(e) => setCompanions(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-24 px-4 py-2 rounded-xl bg-[#090714] border border-purple-900/30 text-white text-sm focus:outline-none focus:border-purple-500 text-center font-bold"
                        />
                        <span className="text-xs text-slate-400">
                          (Máximo {maxCompanions} pases adicionales autorizados)
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Dietary restrictions (only if attending) */}
                  {rsvpStatus === 'confirmed' && askDietary && (
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                        Alergias o menú especial (Opcional)
                      </label>
                      <input
                        type="text"
                        value={dietary}
                        onChange={(e) => setDietary(e.target.value)}
                        placeholder="Ej: Vegetariano, celíaco, sin mariscos..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#090714] border border-purple-900/30 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  )}

                  {/* Message / Dedication */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Mensaje o dedicatoria para los anfitriones (Opcional)
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="¡Escribe tus felicitaciones o un lindo mensaje!..."
                      className="w-full px-3.5 py-2 rounded-xl bg-[#090714] border border-purple-900/30 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rsd-glow-button py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 mt-3 disabled:opacity-50 shadow-xl"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Enviando confirmación...</span>
                      </>
                    ) : (
                      <span>{hasPreviousSubmission ? 'Guardar Cambios de Asistencia' : 'Confirmar Mi Asistencia'}</span>
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
