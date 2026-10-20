import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import {
  Sparkles,
  Plus,
  Calendar,
  Users,
  Eye,
  ExternalLink,
  Edit,
  Clock,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react'
import { SignOutButton } from '@/components/layout/SignOutButton'

export const metadata = {
  title: 'Mi Panel',
  description: 'Administración de eventos e invitaciones digitales en Nuviax.',
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Check if current user has internal admin/advisor privileges
  const { data: userRole } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user?.id || '')
    .in('role', ['admin', 'advisor'])
    .maybeSingle()

  const isAdmin = userRole?.role === 'admin' || userRole?.role === 'advisor'

  // Fetch events belonging to user
  const { data: events = [] } = await supabase
    .from('events')
    .select('*, guests(count), plans(name, code)')
    .order('created_at', { ascending: false })

  const userEvents = events || []

  // Counters
  const totalEvents = userEvents.length
  const publishedEvents = userEvents.filter((e) => e.status === 'published').length
  const totalViews = userEvents.reduce((acc, curr) => acc + (curr.views_count || 0), 0)

  return (
    <div className="min-h-screen bg-[#090714] text-[#F8FAFC]">
      {/* Top bar */}
      <header className="border-b border-purple-900/20 bg-[#0C091C]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-lg text-white">Nuviax</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 hidden sm:inline-block">
              {user?.email}
            </span>

            {isAdmin && (
              <Link
                href="/admin"
                className="px-3 py-1.5 rounded-xl bg-purple-600/30 border border-purple-500/40 text-purple-200 text-xs font-bold flex items-center gap-1.5 hover:bg-purple-600/50 transition-colors shadow-sm"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
                <span>Consola Admin</span>
              </Link>
            )}

            <Link
              href="/dashboard/events/new"
              className="rsd-glow-button text-xs font-bold text-white px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Evento</span>
            </Link>

            <SignOutButton />
          </div>
        </div>
      </header>

      {/* Main dashboard content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Admin Banner if logged in as Admin */}
        {isAdmin && (
          <div className="mb-8 p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0">
                <ShieldAlert className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-white flex items-center gap-2">
                  <span>Modo Administrador Activo</span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {userRole?.role === 'admin' ? 'Administrador Global' : 'Asesor'}
                  </span>
                </p>
                <p className="text-[11px] text-purple-300/80 mt-0.5">
                  Estás visualizando el panel de cliente. Puedes ingresar a la consola operativa en cualquier momento.
                </p>
              </div>
            </div>
            <Link
              href="/admin"
              className="rsd-glow-button px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 shrink-0 shadow-lg"
            >
              <span>Ir a Consola Operativa</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Welcome Section */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-white">
            Panel de Control
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Supervisa tus celebraciones, publicaciones y respuestas de invitados en tiempo real.
          </p>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="rsd-glow-card p-6 rounded-2xl border border-purple-900/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Eventos Creados
              </span>
              <Calendar className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-3xl font-extrabold text-white mt-4">{totalEvents}</p>
          </div>

          <div className="rsd-glow-card p-6 rounded-2xl border border-purple-900/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Invitaciones Publicadas
              </span>
              <Sparkles className="w-5 h-5 text-pink-400" />
            </div>
            <p className="text-3xl font-extrabold rsd-gradient-text mt-4">{publishedEvents}</p>
          </div>

          <div className="rsd-glow-card p-6 rounded-2xl border border-purple-900/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Visitas Totales
              </span>
              <Eye className="w-5 h-5 text-indigo-400" />
            </div>
            <p className="text-3xl font-extrabold text-white mt-4">{totalViews}</p>
          </div>
        </div>

        {/* Events List Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Mis Invitaciones</h2>
            <Link
              href="/catalog"
              className="text-xs font-semibold text-pink-400 hover:text-pink-300 flex items-center gap-1"
            >
              <span>Explorar Plantillas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {userEvents.length === 0 ? (
            <div className="rsd-glow-card p-12 rounded-3xl text-center space-y-4 border border-purple-900/30">
              <div className="w-16 h-16 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center mx-auto">
                <Calendar className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Aún no has creado invitaciones</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                Elige una plantilla del catálogo para comenzar a personalizar tu invitación digital en minutos.
              </p>
              <div className="pt-2">
                <Link
                  href="/catalog"
                  className="rsd-glow-button inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Crear Primera Invitación</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userEvents.map((event) => (
                <div
                  key={event.id}
                  className="rsd-glow-card p-6 rounded-2xl border border-purple-900/30 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          event.status === 'published'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : event.status === 'expired'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {event.status === 'published'
                          ? 'Publicada'
                          : event.status === 'expired'
                          ? 'Expirada'
                          : 'Borrador'}
                      </span>
                      <span className="text-xs text-purple-400 font-medium">
                        {event.plans?.name || 'Esencial'}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white">{event.title}</h3>
                    <p className="text-xs text-slate-400 mt-1 font-mono truncate">
                      /{event.slug}
                    </p>

                    {event.event_date && (
                      <p className="text-xs text-slate-300 mt-3 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-purple-400" />
                        <span>
                          {new Date(event.event_date).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </p>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-purple-900/20 flex items-center justify-between gap-2">
                    <Link
                      href={`/dashboard/events/${event.id}/guests`}
                      className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1"
                    >
                      <Users className="w-3.5 h-3.5 text-purple-400" />
                      <span>Invitados</span>
                    </Link>

                    <div className="flex items-center gap-1.5">
                      {event.demo_token && !event.demo_revoked && (
                        <a
                          href={`/preview/${event.demo_token}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-pink-300 transition-colors"
                          title="Ver Demo Privada"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </a>
                      )}

                      <Link
                        href={`/dashboard/events/${event.id}/edit`}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                        title="Editar invitación"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>

                      {event.status === 'published' ? (
                        <a
                          href={`/${event.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 hover:text-white transition-colors"
                          title="Ver invitación pública"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <Link
                          href={`/dashboard/events/${event.id}/checkout`}
                          className="px-2.5 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white font-bold text-[11px] transition-colors shadow-sm"
                          title="Contratar Plan y Publicar"
                        >
                          Activar
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
