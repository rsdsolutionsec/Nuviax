import { createClient } from '@/lib/supabase/server'
import { Users, Search, Shield, Calendar, Mail, CheckCircle2, AlertCircle } from 'lucide-react'

export const metadata = {
  title: 'Clientes & Usuarios | Consola Nuviax',
  description: 'Gestión y directorio de cuentas de usuarios registrados.',
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const query = resolvedSearchParams?.q?.trim().toLowerCase() || ''

  const supabase = await createClient()

  // Fetch profiles with user_roles and events count
  const { data: profiles = [] } = await supabase
    .from('profiles')
    .select(`
      id,
      email,
      full_name,
      phone,
      created_at,
      user_roles(role),
      events(count)
    `)
    .order('created_at', { ascending: false })

  const filteredUsers = (profiles || []).filter((user: any) => {
    if (!query) return true
    const email = user.email?.toLowerCase() || ''
    const name = user.full_name?.toLowerCase() || ''
    return email.includes(query) || name.includes(query)
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Clientes & Cuentas de Usuario</h1>
          <p className="text-xs text-slate-400 mt-1">
            Directorio general de usuarios registrados, roles activos e invitaciones asociadas.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-purple-900/30 border border-purple-800/40 text-purple-300 text-xs font-semibold flex items-center gap-2">
          <Users className="w-4 h-4 text-pink-400" />
          <span>{(profiles || []).length} Usuarios Registrados</span>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="rsd-glow-card p-4 rounded-2xl border border-purple-900/30">
        <form method="GET" className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Buscar por correo electrónico o nombre..."
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
      </div>

      {/* Users Table */}
      <div className="rsd-glow-card rounded-2xl border border-purple-900/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0C081D] text-slate-400 uppercase tracking-wider text-[10px] border-b border-purple-900/20">
              <tr>
                <th className="py-3.5 px-4">Usuario</th>
                <th className="py-3.5 px-4">Teléfono</th>
                <th className="py-3.5 px-4">Rol en Plataforma</th>
                <th className="py-3.5 px-4">Eventos Creados</th>
                <th className="py-3.5 px-4">Fecha de Registro</th>
                <th className="py-3.5 px-4 text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-900/15">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No se encontraron usuarios que coincidan con la búsqueda.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u: any) => {
                  const role = u.user_roles?.[0]?.role || 'customer'
                  const eventCount = u.events?.[0]?.count || 0

                  return (
                    <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white font-bold text-[11px]">
                            {u.email ? u.email[0].toUpperCase() : 'U'}
                          </div>
                          <div>
                            <span className="font-bold text-white block">{u.full_name || 'Sin nombre asignado'}</span>
                            <span className="text-[11px] text-slate-400">{u.email}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-300 font-mono text-[11px]">
                        {u.phone || '—'}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            role === 'admin'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : role === 'advisor'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}
                        >
                          {role}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-white">{eventCount}</span>
                        <span className="text-[10px] text-slate-400 ml-1">invitaciones</span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-400">
                        {new Date(u.created_at).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Activo</span>
                        </span>
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
