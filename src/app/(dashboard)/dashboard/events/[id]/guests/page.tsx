'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Download,
  Copy,
  Check,
  Trash2,
  Edit,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Loader2,
} from 'lucide-react'

interface GuestItem {
  id: string
  first_name: string
  last_name: string
  group_name: string | null
  invitation_token: string
  authorized_companions: number
  confirmed_companions: number
  rsvp_status: 'pending' | 'confirmed' | 'declined'
  rsvp_responded_at: string | null
  dietary_restrictions: string | null
  notes: string | null
}

interface EventData {
  id: string
  title: string
  slug: string
  plans?: {
    code: string
    name: string
  }
}

export default function GuestManagementPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)
  const eventId = resolvedParams.id

  const [event, setEvent] = useState<EventData | null>(null)
  const [guests, setGuests] = useState<GuestItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'pending' | 'declined'>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [copiedToken, setCopiedToken] = useState<string | null>(null)

  // Add guest modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [authorizedCompanions, setAuthorizedCompanions] = useState(0)
  const [groupName, setGroupName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    fetchEventAndGuests()
  }, [eventId])

  const fetchEventAndGuests = async () => {
    setIsLoading(true)
    try {
      const supabase = createClient()

      // 1. Fetch event
      const { data: eventData } = await supabase
        .from('events')
        .select('id, title, slug, plans(code, name)')
        .eq('id', eventId)
        .single()

      if (eventData) {
        setEvent(eventData as any)
      }

      // 2. Fetch guests
      const { data: guestsData } = await supabase
        .from('guests')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false })

      if (guestsData) {
        setGuests(guestsData as GuestItem[])
      }
    } catch (err) {
      console.error('Error fetching guests:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const supabase = createClient()
      const randomToken = Math.random().toString(36).substring(2, 12) + Date.now().toString(36)

      const { data, error } = await supabase
        .from('guests')
        .insert({
          event_id: eventId,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          authorized_companions: authorizedCompanions,
          group_name: groupName.trim() || null,
          invitation_token: randomToken,
          rsvp_status: 'pending',
        })
        .select()
        .single()

      if (error) {
        setErrorMessage(error.message)
        return
      }

      setGuests([data as GuestItem, ...guests])
      setIsModalOpen(false)
      setFirstName('')
      setLastName('')
      setAuthorizedCompanions(0)
      setGroupName('')
    } catch {
      setErrorMessage('Error al registrar el invitado.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteGuest = async (id: string, name: string) => {
    if (!confirm(`¿Estás seguro de eliminar a "${name}" de la lista?`)) return

    try {
      const supabase = createClient()
      await supabase.from('guests').delete().eq('id', id)
      setGuests(guests.filter((g) => g.id !== id))
    } catch (err) {
      alert('No se pudo eliminar el invitado.')
    }
  }

  const handleCopyLink = (token: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
    const link = `${origin}/${event?.slug}?t=${token}`
    navigator.clipboard.writeText(link)
    setCopiedToken(token)
    setTimeout(() => setCopiedToken(null), 2500)
  }

  const handleExportCSV = () => {
    if (guests.length === 0) return

    const headers = [
      'Nombre',
      'Apellido',
      'Grupo',
      'Pases Autorizados',
      'Estado RSVP',
      'Acompañantes Confirmados',
      'Restricciones Dietarias',
      'Notas',
      'Token Enlace',
    ]

    const rows = guests.map((g) => [
      `"${g.first_name}"`,
      `"${g.last_name || ''}"`,
      `"${g.group_name || ''}"`,
      g.authorized_companions,
      g.rsvp_status,
      g.confirmed_companions,
      `"${g.dietary_restrictions || ''}"`,
      `"${g.notes || ''}"`,
      g.invitation_token,
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `invitados-${event?.slug || 'evento'}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Filtered guests
  const filteredGuests = guests.filter((g) => {
    const matchesSearch =
      g.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.group_name?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'all' || g.rsvp_status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Calculations
  const totalRegistered = guests.length
  const totalConfirmedGuests = guests.filter((g) => g.rsvp_status === 'confirmed').length
  const totalDeclinedGuests = guests.filter((g) => g.rsvp_status === 'declined').length
  const totalPendingGuests = guests.filter((g) => g.rsvp_status === 'pending').length
  const totalConfirmedAttendees = guests.reduce(
    (acc, g) => (g.rsvp_status === 'confirmed' ? acc + 1 + g.confirmed_companions : acc),
    0
  )

  return (
    <div className="min-h-screen bg-[#090714] text-[#F8FAFC]">
      {/* Top Header */}
      <header className="border-b border-purple-900/20 bg-[#0C091C]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="font-extrabold text-base text-white">Gestión de Invitados</h1>
              <p className="text-[11px] text-purple-400 font-mono truncate max-w-xs">
                {event?.title || 'Cargando...'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              disabled={guests.length === 0}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-colors disabled:opacity-40"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exportar CSV</span>
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="rsd-glow-button text-xs font-bold text-white px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Añadir Invitado</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
          <div className="rsd-glow-card p-5 rounded-2xl border border-purple-900/30">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Registrados
            </span>
            <p className="text-2xl font-extrabold text-white mt-2">{totalRegistered}</p>
          </div>

          <div className="rsd-glow-card p-5 rounded-2xl border border-purple-900/30">
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
              Confirmados
            </span>
            <p className="text-2xl font-extrabold text-emerald-400 mt-2">{totalConfirmedGuests}</p>
          </div>

          <div className="rsd-glow-card p-5 rounded-2xl border border-purple-900/30">
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
              Pendientes
            </span>
            <p className="text-2xl font-extrabold text-amber-400 mt-2">{totalPendingGuests}</p>
          </div>

          <div className="rsd-glow-card p-5 rounded-2xl border border-purple-900/30">
            <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400">
              No Asistirán
            </span>
            <p className="text-2xl font-extrabold text-rose-400 mt-2">{totalDeclinedGuests}</p>
          </div>

          <div className="rsd-glow-card p-5 rounded-2xl border border-fuchsia-500/40 bg-gradient-to-br from-purple-950/40 to-[#120D26] col-span-2 sm:col-span-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-pink-300">
              Asistentes Totales
            </span>
            <p className="text-2xl font-extrabold rsd-gradient-text mt-2">{totalConfirmedAttendees}</p>
            <span className="text-[10px] text-slate-400">con acompañantes</span>
          </div>
        </div>

        {/* SEARCH & FILTERS BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre o familia..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#120E24] border border-purple-900/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              Todos ({guests.length})
            </button>
            <button
              onClick={() => setStatusFilter('confirmed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === 'confirmed'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              Confirmados ({totalConfirmedGuests})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === 'pending'
                  ? 'bg-amber-600 text-white'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              Pendientes ({totalPendingGuests})
            </button>
            <button
              onClick={() => setStatusFilter('declined')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === 'declined'
                  ? 'bg-rose-600 text-white'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              No Asisten ({totalDeclinedGuests})
            </button>
          </div>
        </div>

        {/* GUEST TABLE */}
        <div className="rsd-glow-card rounded-2xl border border-purple-900/30 overflow-hidden">
          {isLoading ? (
            <div className="py-20 text-center text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-purple-400" />
              <p className="text-xs">Cargando lista de invitados...</p>
            </div>
          ) : filteredGuests.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-3">
              <Users className="w-10 h-10 mx-auto text-purple-500/40" />
              <p className="text-sm">No se encontraron invitados con los filtros actuales.</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-xs font-bold text-pink-400 hover:text-pink-300"
              >
                + Añadir nuevo invitado
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0C081D] text-slate-400 uppercase tracking-wider text-[10px] border-b border-purple-900/20">
                  <tr>
                    <th className="py-3.5 px-4">Invitado</th>
                    <th className="py-3.5 px-4">Grupo Familiar</th>
                    <th className="py-3.5 px-4 text-center">Pases</th>
                    <th className="py-3.5 px-4 text-center">Estado RSVP</th>
                    <th className="py-3.5 px-4">Detalles / Notas</th>
                    <th className="py-3.5 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-900/15">
                  {filteredGuests.map((guest) => (
                    <tr key={guest.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-white block">
                          {guest.first_name} {guest.last_name}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          Token: {guest.invitation_token.substring(0, 8)}...
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-300">
                        {guest.group_name || '—'}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="font-semibold text-white">
                          {guest.rsvp_status === 'confirmed'
                            ? 1 + guest.confirmed_companions
                            : guest.authorized_companions + 1}
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          ({guest.authorized_companions} extra)
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            guest.rsvp_status === 'confirmed'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : guest.rsvp_status === 'declined'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {guest.rsvp_status === 'confirmed' && <CheckCircle2 className="w-3 h-3" />}
                          {guest.rsvp_status === 'declined' && <XCircle className="w-3 h-3" />}
                          {guest.rsvp_status === 'pending' && <Clock className="w-3 h-3" />}
                          <span>
                            {guest.rsvp_status === 'confirmed'
                              ? 'Confirmado'
                              : guest.rsvp_status === 'declined'
                              ? 'No Asistirá'
                              : 'Pendiente'}
                          </span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-300 max-w-xs truncate">
                        {guest.dietary_restrictions && (
                          <span className="block text-[11px] text-amber-300 truncate">
                            🍽️ {guest.dietary_restrictions}
                          </span>
                        )}
                        {guest.notes && (
                          <span className="block text-[11px] text-slate-400 italic truncate">
                            "{guest.notes}"
                          </span>
                        )}
                        {!guest.dietary_restrictions && !guest.notes && '—'}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleCopyLink(guest.invitation_token)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-purple-600/20 text-slate-300 hover:text-purple-300 transition-colors"
                            title="Copiar enlace personalizado"
                          >
                            {copiedToken === guest.invitation_token ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>

                          <button
                            onClick={() =>
                              handleDeleteGuest(
                                guest.id,
                                `${guest.first_name} ${guest.last_name || ''}`
                              )
                            }
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-600/20 text-slate-300 hover:text-rose-400 transition-colors"
                            title="Eliminar invitado"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* ADD GUEST MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#110D24] border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
            <h3 className="text-xl font-bold text-white mb-1">Añadir Invitado</h3>
            <p className="text-xs text-slate-400 mb-6">
              Registra un nuevo invitado o grupo para generar su pase exclusivo.
            </p>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleAddGuest} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase font-bold text-slate-300 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Ej: Daniel"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090714] border border-purple-900/30 text-white text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-slate-300 mb-1">
                  Apellido
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Ej: Andrade"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090714] border border-purple-900/30 text-white text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-slate-300 mb-1">
                  Acompañantes autorizados
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={authorizedCompanions}
                  onChange={(e) => setAuthorizedCompanions(parseInt(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090714] border border-purple-900/30 text-white text-sm focus:outline-none focus:border-purple-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Indica cuántas personas adicionales puede llevar (0 = solo el invitado).
                </span>
              </div>

              <div>
                <label className="block uppercase font-bold text-slate-300 mb-1">
                  Grupo o Familia (Opcional)
                </label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Ej: Familia Andrade Gómez"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090714] border border-purple-900/30 text-white text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rsd-glow-button px-6 py-2.5 rounded-xl text-white font-bold text-xs flex items-center gap-1.5 shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <span>Guardar Invitado</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
