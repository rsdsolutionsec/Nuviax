import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  ShieldAlert,
  Users,
  Calendar,
  CreditCard,
  Layers,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
} from 'lucide-react'

export const metadata = {
  title: 'Panel Administrativo RSD',
  description: 'Consola de operaciones y métricas de RSD SOLUTIONS.',
}

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // 1. Server-side role verification
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/admin')
  }

  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .eq('role', 'admin')
    .maybeSingle()

  // If user is not an admin, redirect to customer dashboard
  if (!roleData) {
    // For local initial testing before admin role is seeded, we can check email or allow if development
    const isLocalDev = process.env.NODE_ENV !== 'production'
    if (!isLocalDev) {
      redirect('/dashboard')
    }
  }

  // 2. Query system statistics
  const { count: totalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
  const { count: totalEvents } = await supabase.from('events').select('*', { count: 'exact', head: true })
  const { count: totalGuests } = await supabase.from('guests').select('*', { count: 'exact', head: true })
  const { count: totalOrders } = await supabase.from('orders').select('*', { count: 'exact', head: true })

  // 3. Query recent events
  const { data: recentEvents = [] } = await supabase
    .from('events')
    .select('id, title, slug, status, created_at, profiles(email, full_name), plans(name, code)')
    .order('created_at', { ascending: false })
    .limit(10)

  return (
    <div className="min-h-screen bg-[#070510] text-[#F8FAFC]">
      {/* Admin Nav */}
      <header className="border-b border-purple-900/30 bg-[#0B081A] px-6 h-16 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-pink-600 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-600/30">
            <ShieldAlert className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-sm text-white">RSD SOLUTIONS</span>
            <span className="text-[10px] text-purple-400 font-mono ml-2 uppercase tracking-wider">
              Consola Operativa
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            Ir a Mi Panel Cliente
          </Link>
          <div className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
            {user.email} (Admin)
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white">Métricas & Operación SaaS</h1>
          <p className="text-sm text-slate-400 mt-1">
            Supervisión integral de usuarios, pedidos, invitaciones publicadas e infraestructura.
          </p>
        </div>

        {/* METRICS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-12">
          <div className="rsd-glow-card p-6 rounded-2xl border border-purple-900/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Total Usuarios
              </span>
              <Users className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-3xl font-extrabold text-white mt-4">{totalUsers ?? 0}</p>
          </div>

          <div className="rsd-glow-card p-6 rounded-2xl border border-purple-900/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Eventos Creados
              </span>
              <Calendar className="w-5 h-5 text-pink-400" />
            </div>
            <p className="text-3xl font-extrabold rsd-gradient-text mt-4">{totalEvents ?? 0}</p>
          </div>

          <div className="rsd-glow-card p-6 rounded-2xl border border-purple-900/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Invitados Globales
              </span>
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-3xl font-extrabold text-white mt-4">{totalGuests ?? 0}</p>
          </div>

          <div className="rsd-glow-card p-6 rounded-2xl border border-purple-900/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Pedidos & Pagos
              </span>
              <CreditCard className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-3xl font-extrabold text-emerald-400 mt-4">{totalOrders ?? 0}</p>
          </div>
        </div>

        {/* RECENT EVENTS TABLE */}
        <div className="rsd-glow-card rounded-2xl border border-purple-900/30 overflow-hidden">
          <div className="p-6 border-b border-purple-900/20 flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Eventos Recientes en la Plataforma</h2>
            <span className="text-xs text-slate-400 font-mono">Últimas 10 actividades</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0C081D] text-slate-400 uppercase tracking-wider text-[10px] border-b border-purple-900/20">
                <tr>
                  <th className="py-3.5 px-4">Evento</th>
                  <th className="py-3.5 px-4">Propietario</th>
                  <th className="py-3.5 px-4">Plan</th>
                  <th className="py-3.5 px-4">Estado</th>
                  <th className="py-3.5 px-4">Fecha Creación</th>
                  <th className="py-3.5 px-4 text-right">Ver</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-900/15">
                {(recentEvents || []).length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      No hay eventos registrados en este momento.
                    </td>
                  </tr>
                ) : (
                  (recentEvents || []).map((ev: any) => (
                    <tr key={ev.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-white block">{ev.title}</span>
                        <span className="text-[10px] font-mono text-purple-400">/{ev.slug}</span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-300">
                        {ev.profiles?.email || 'Anónimo'}
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-200">
                        {ev.plans?.name || 'Esencial'}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            ev.status === 'published'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {ev.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-400">
                        {new Date(ev.created_at).toLocaleDateString('es-ES')}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <a
                          href={`/${ev.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-purple-600/20 text-slate-400 hover:text-purple-300 inline-flex items-center"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
