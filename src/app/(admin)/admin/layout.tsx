import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  ShieldAlert,
  BarChart3,
  Users,
  UserCheck,
  Palette,
  Calendar,
  Receipt,
  DollarSign,
  ShieldCheck,
  History,
  ArrowLeft,
  Lock,
} from 'lucide-react'

export const metadata = {
  title: 'Consola Operativa Nuviax | RSD SOLUTIONS',
  description: 'Panel de administración, métricas y control de la plataforma SaaS Nuviax.',
}

const NAV_ITEMS = [
  { name: 'Dashboard Ejecutivo', href: '/admin', icon: BarChart3 },
  { name: 'Clientes & Usuarios', href: '/admin/users', icon: Users },
  { name: 'Equipo & Asesores', href: '/admin/team', icon: UserCheck },
  { name: 'Gestión de Plantillas (18)', href: '/admin/templates', icon: Palette },
  { name: 'Eventos & Vigencias', href: '/admin/events', icon: Calendar },
  { name: 'Órdenes & Pagos', href: '/admin/orders', icon: Receipt },
  { name: 'Finanzas & Métricas', href: '/admin/finances', icon: DollarSign },
  { name: 'Planes & Excepciones', href: '/admin/plans', icon: ShieldCheck },
  { name: 'Registro de Auditoría', href: '/admin/audit', icon: History },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/admin')
  }

  // Verify server-side roles
  const { data: userRole } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .in('role', ['admin', 'advisor'])
    .maybeSingle()

  const isLocalDev = process.env.NODE_ENV !== 'production'
  const currentRole = userRole?.role || (isLocalDev ? 'admin' : null)

  if (!currentRole && !isLocalDev) {
    redirect('/dashboard')
  }

  const isAdmin = currentRole === 'admin'
  const isAdvisor = currentRole === 'advisor'

  return (
    <div className="min-h-screen bg-[#070510] text-[#F8FAFC] flex flex-col md:flex-row">
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-[#0B081A] border-r border-purple-900/30 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo & Platform Info */}
          <div className="p-6 border-b border-purple-900/20">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-600 via-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-600/30">
                <ShieldAlert className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-sm text-white tracking-wide block">NUVIAX SAAS</span>
                <span className="text-[10px] text-purple-400 font-mono uppercase tracking-wider block">
                  RSD SOLUTIONS
                </span>
              </div>
            </div>

            <div className="mt-4 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">
                {isAdmin ? '🛡️ Admin Global' : '👓 Asesor (Solo Lectura)'}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all group"
                >
                  <Icon className="w-4 h-4 text-purple-400 group-hover:text-pink-400 transition-colors" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-purple-900/20 space-y-3">
          <div className="px-3 py-2 rounded-xl bg-[#070512] border border-purple-900/30 text-[11px]">
            <p className="text-slate-400 truncate">{user.email}</p>
            <p className="text-[9px] text-purple-400 font-mono mt-0.5">Seguridad RLS Activa</p>
          </div>

          <div className="flex items-center justify-between pt-1 text-xs">
            <Link
              href="/dashboard"
              className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-[11px]"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Panel Cliente</span>
            </Link>
            <Link
              href="/"
              className="text-slate-400 hover:text-purple-300 transition-colors text-[11px]"
            >
              Web Pública
            </Link>
          </div>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Advisor disclaimer banner if applicable */}
        {isAdvisor && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-2.5 text-xs text-amber-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>
                <strong>Modo Asesor:</strong> Tienes acceso de solo lectura para soporte y acompañamiento comercial. La edición de invitaciones, configuración de planes y datos médicos/alergias de invitados están restringidos.
              </span>
            </div>
            <span className="text-[10px] font-mono uppercase bg-amber-500/20 px-2 py-0.5 rounded font-bold">Read-Only</span>
          </div>
        )}

        {/* Content container */}
        <main className="flex-1 p-6 sm:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
