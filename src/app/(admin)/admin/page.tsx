import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import {
  Users,
  Calendar,
  CreditCard,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Layers,
} from 'lucide-react'

export const metadata = {
  title: 'Dashboard Ejecutivo | Consola Nuviax',
  description: 'Métricas clave y salud operativa del negocio SaaS.',
}

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // 1. Fetch KPI metrics from DB
  const { count: totalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
  const { count: totalEvents } = await supabase.from('events').select('*', { count: 'exact', head: true })
  const { count: publishedEvents } = await supabase.from('events').select('*', { count: 'exact', head: true }).eq('status', 'published')
  const { count: draftEvents } = await supabase.from('events').select('*', { count: 'exact', head: true }).eq('status', 'draft')
  const { count: totalGuests } = await supabase.from('guests').select('*', { count: 'exact', head: true })
  const { count: totalOrders } = await supabase.from('orders').select('*', { count: 'exact', head: true })

  // 2. Query completed payments for revenue calculation
  const { data: orders = [] } = await supabase
    .from('orders')
    .select('amount, status, created_at')
    .eq('status', 'completed')

  const grossSales = (orders || []).reduce((acc: number, curr: any) => acc + Number(curr.amount || 0), 0)
  // Estimated net operating formula: Gross sales - 4% gateway fees
  const netRevenue = grossSales * 0.96

  // 3. Query recent events
  const { data: recentEvents = [] } = await supabase
    .from('events')
    .select('id, title, slug, status, created_at, demo_token, profiles(email, full_name), plans(name, code)')
    .order('created_at', { ascending: false })
    .limit(8)

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Dashboard Ejecutivo</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Resumen en tiempo real de ingresos, adopción de plantillas, invitaciones publicadas y actividad de la plataforma.
        </p>
      </div>

      {/* METRICS ROW 1: REVENUE & CORE KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rsd-glow-card p-5 rounded-2xl border border-purple-900/30">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Ventas Brutas
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">${grossSales.toFixed(2)}</p>
          <p className="text-[10px] text-slate-400 mt-1">USD acumulado en compras únicas</p>
        </div>

        <div className="rsd-glow-card p-5 rounded-2xl border border-purple-900/30">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Ingresos Netos Estimados
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-emerald-400 mt-3">${netRevenue.toFixed(2)}</p>
          <p className="text-[10px] text-slate-400 mt-1">Fórmula: Bruto - 4% tarifa pasarela</p>
        </div>

        <div className="rsd-glow-card p-5 rounded-2xl border border-purple-900/30">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Invitaciones Publicadas
            </span>
            <div className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold rsd-gradient-text mt-3">{publishedEvents ?? 0}</p>
          <p className="text-[10px] text-slate-400 mt-1">De {totalEvents ?? 0} creadas en total</p>
        </div>

        <div className="rsd-glow-card p-5 rounded-2xl border border-purple-900/30">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Total Clientes Registrados
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">{totalUsers ?? 0}</p>
          <p className="text-[10px] text-slate-400 mt-1">{totalGuests ?? 0} invitados gestionados</p>
        </div>
      </div>

      {/* METRICS ROW 2: CONVERSION & PLATFORM HEALTH */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-[#0F0B20] border border-purple-900/30 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Borradores Pendientes</p>
            <p className="text-2xl font-bold text-amber-300 mt-1">{draftEvents ?? 0}</p>
            <p className="text-[10px] text-slate-500 mt-1">Oportunidades de conversión a pago</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xs">
            {totalEvents ? `${Math.round(((draftEvents || 0) / totalEvents) * 100)}%` : '0%'}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F0B20] border border-purple-900/30 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Tasa de Conversión a Pago</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">
              {totalEvents ? `${((publishedEvents || 0) / totalEvents * 100).toFixed(1)}%` : '0%'}
            </p>
            <p className="text-[10px] text-slate-500 mt-1">Proporción eventos publicados / creados</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F0B20] border border-purple-900/30 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Biblioteca de Plantillas</p>
            <p className="text-2xl font-bold text-purple-300 mt-1">18 Diseños</p>
            <p className="text-[10px] text-slate-500 mt-1">3 Programadores · 9 Categorías</p>
          </div>
          <Link
            href="/admin/templates"
            className="px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <span>Ver</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* RECENT EVENTS TABLE */}
      <div className="rsd-glow-card rounded-2xl border border-purple-900/30 overflow-hidden">
        <div className="p-5 border-b border-purple-900/20 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white">Eventos e Invitaciones Recientes</h2>
            <p className="text-xs text-slate-400 mt-0.5">Últimos eventos registrados en la plataforma</p>
          </div>
          <Link
            href="/admin/events"
            className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
          >
            <span>Ver todos</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0C081D] text-slate-400 uppercase tracking-wider text-[10px] border-b border-purple-900/20">
              <tr>
                <th className="py-3 px-4">Evento</th>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Plan</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4">Demo Privada</th>
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-900/15">
              {(recentEvents || []).length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500">
                    No hay eventos registrados en este momento.
                  </td>
                </tr>
              ) : (
                (recentEvents || []).map((ev: any) => (
                  <tr key={ev.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-bold text-white block">{ev.title}</span>
                      <span className="text-[10px] font-mono text-purple-400">/{ev.slug}</span>
                    </td>

                    <td className="py-3 px-4 text-slate-300">
                      {ev.profiles?.email || 'Anónimo'}
                    </td>

                    <td className="py-3 px-4 font-semibold text-slate-200">
                      {ev.plans?.name || 'Esencial'}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          ev.status === 'published'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {ev.status === 'published' ? 'Publicado' : 'Borrador'}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      {ev.demo_token ? (
                        <a
                          href={`/preview/${ev.demo_token}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-pink-400 hover:text-pink-300 font-mono inline-flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Ver Demo</span>
                        </a>
                      ) : (
                        <span className="text-slate-600 text-[10px]">—</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-slate-400">
                      {new Date(ev.created_at).toLocaleDateString('es-ES')}
                    </td>

                    <td className="py-3 px-4 text-right">
                      {ev.status === 'published' ? (
                        <a
                          href={`/${ev.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-purple-600/20 text-slate-300 hover:text-purple-300 inline-flex items-center"
                          title="Ver invitación pública"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <span className="text-slate-600 text-[10px]">Privado</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
