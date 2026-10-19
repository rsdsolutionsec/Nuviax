import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Calendar, Search, Eye, ExternalLink, Clock, ShieldCheck, Filter } from 'lucide-react'

export const metadata = {
  title: 'Gestión de Eventos | Consola Nuviax',
  description: 'Supervisión integral de invitaciones, vigencias y enlaces de clientes.',
}

export default async function AdminEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const query = resolvedSearchParams?.q?.trim().toLowerCase() || ''
  const statusFilter = resolvedSearchParams?.status || 'all'

  const supabase = await createClient()

  // Fetch events with profiles, plans, templates, guests count
  const { data: events = [] } = await supabase
    .from('events')
    .select(`
      id,
      title,
      slug,
      status,
      event_date,
      expires_at,
      demo_token,
      demo_revoked,
      created_at,
      profiles(email, full_name),
      plans(name, code),
      templates(name, code),
      guests(count)
    `)
    .order('created_at', { ascending: false })

  const filteredEvents = (events || []).filter((ev: any) => {
    if (statusFilter !== 'all' && ev.status !== statusFilter) return false
    if (!query) return true
    const title = ev.title?.toLowerCase() || ''
    const slug = ev.slug?.toLowerCase() || ''
    const owner = ev.profiles?.email?.toLowerCase() || ''
    return title.includes(query) || slug.includes(query) || owner.includes(query)
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Eventos & Vigencias de Publicación</h1>
          <p className="text-xs text-slate-400 mt-1">
            Supervisión técnica de invitaciones creadas, estados de publicación y fechas de vencimiento.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-purple-900/30 border border-purple-800/40 text-purple-300 text-xs font-semibold flex items-center gap-2">
          <Calendar className="w-4 h-4 text-pink-400" />
          <span>{(events || []).length} Eventos Registrados</span>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="rsd-glow-card p-4 rounded-2xl border border-purple-900/30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <form method="GET" className="flex items-center gap-3 flex-1">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Buscar por título, slug o email del cliente..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0B0819] border border-purple-900/30 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors"
          >
            Buscar
          </button>
        </form>

        <div className="flex items-center gap-1.5 border-t sm:border-t-0 pt-3 sm:pt-0 border-purple-900/20">
          <Link
            href="/admin/events"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              statusFilter === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            Todos
          </Link>
          <Link
            href="/admin/events?status=published"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              statusFilter === 'published'
                ? 'bg-purple-600 text-white'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            Publicados
          </Link>
          <Link
            href="/admin/events?status=draft"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              statusFilter === 'draft'
                ? 'bg-purple-600 text-white'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            Borradores
          </Link>
        </div>
      </div>

      {/* Events Table */}
      <div className="rsd-glow-card rounded-2xl border border-purple-900/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0C081D] text-slate-400 uppercase tracking-wider text-[10px] border-b border-purple-900/20">
              <tr>
                <th className="py-3.5 px-4">Invitación / Slug</th>
                <th className="py-3.5 px-4">Cliente Propietario</th>
                <th className="py-3.5 px-4">Plantilla</th>
                <th className="py-3.5 px-4">Plan Activo</th>
                <th className="py-3.5 px-4">Estado</th>
                <th className="py-3.5 px-4">Demo Privada</th>
                <th className="py-3.5 px-4">Vigencia Expiración</th>
                <th className="py-3.5 px-4 text-right">Ver Online</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-900/15">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No se encontraron eventos con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((ev: any) => {
                  const guestCount = ev.guests?.[0]?.count || 0
                  const isPublished = ev.status === 'published'

                  return (
                    <tr key={ev.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-white block">{ev.title}</span>
                        <span className="text-[11px] font-mono text-purple-400">/{ev.slug}</span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-300">
                        {ev.profiles?.email || 'Anónimo'}
                      </td>

                      <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                        {ev.templates?.name || 'Clásica'}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-purple-300">
                          {ev.plans?.name || 'Esencial'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isPublished
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {isPublished ? 'Publicada' : 'Borrador'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {ev.demo_token && !ev.demo_revoked ? (
                          <a
                            href={`/preview/${ev.demo_token}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-pink-400 hover:text-pink-300 font-mono inline-flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Demo</span>
                          </a>
                        ) : (
                          <span className="text-slate-600 text-[10px]">—</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                        {ev.expires_at ? (
                          new Date(ev.expires_at).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        ) : (
                          <span className="text-slate-600">Al pagar</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {isPublished ? (
                          <a
                            href={`/${ev.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-purple-600/20 text-slate-300 hover:text-purple-300 inline-flex items-center"
                            title="Ver en vivo"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <span className="text-slate-600 text-[10px]">Privado</span>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
