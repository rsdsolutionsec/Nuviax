import { createClient } from '@/lib/supabase/server'
import { UserCheck, Shield, Lock, Eye, AlertCircle, CheckCircle2, Info } from 'lucide-react'

export const metadata = {
  title: 'Equipo & Asesores | Consola Nuviax',
  description: 'Gestión de roles internos, privilegios y equipo de asesores de ventas.',
}

export default async function AdminTeamPage() {
  const supabase = await createClient()

  // Fetch users with roles admin, advisor, support
  const { data: teamMembers = [] } = await supabase
    .from('user_roles')
    .select(`
      id,
      role,
      granted_at,
      profiles:user_id (
        id,
        email,
        full_name,
        created_at
      )
    `)
    .in('role', ['admin', 'advisor', 'support'])
    .order('granted_at', { ascending: false })

  const teamList = teamMembers || []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white">Equipo Interno & Asesores</h1>
        <p className="text-xs text-slate-400 mt-1">
          Control de acceso basado en roles (RBAC) para el personal de RSD SOLUTIONS y asesores comerciales.
        </p>
      </div>

      {/* Advisor Security Policy Notice */}
      <div className="p-5 rounded-2xl bg-[#110D24] border border-purple-900/30 space-y-3">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-bold text-white">Directiva de Seguridad para Asesores Comerciales</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="space-y-1.5 p-3 rounded-xl bg-purple-950/20 border border-purple-900/20">
            <span className="font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Privilegios Permitidos:</span>
            </span>
            <ul className="list-disc list-inside text-slate-400 space-y-1 text-[11px] pl-1">
              <li>Consultar lista completa de clientes registrados.</li>
              <li>Visualizar estado general de invitaciones y plantillas elegidas.</li>
              <li>Comprobar vigencia de publicación y plan activo.</li>
              <li>Acompañar al cliente durante el proceso comercial.</li>
            </ul>
          </div>

          <div className="space-y-1.5 p-3 rounded-xl bg-rose-950/20 border border-rose-900/20">
            <span className="font-bold text-rose-400 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>Restricciones Estrictas de Seguridad:</span>
            </span>
            <ul className="list-disc list-inside text-slate-400 space-y-1 text-[11px] pl-1">
              <li>Bloqueo total de edición o borrado de eventos de clientes.</li>
              <li>Sin acceso a listas de invitados, tokens o datos médicos/alergias.</li>
              <li>Sin capacidad de modificar precios, planes o transacciones.</li>
              <li>Impedimento técnico para auto-asignarse permisos de administrador.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Team Members Table */}
      <div className="rsd-glow-card rounded-2xl border border-purple-900/30 overflow-hidden">
        <div className="p-5 border-b border-purple-900/20 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">Miembros del Equipo Autorizados</h2>
          <span className="text-xs text-slate-400 font-mono">{teamList.length} Miembros Activos</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0C081D] text-slate-400 uppercase tracking-wider text-[10px] border-b border-purple-900/20">
              <tr>
                <th className="py-3.5 px-4">Miembro</th>
                <th className="py-3.5 px-4">Rol Asignado</th>
                <th className="py-3.5 px-4">Nivel de Acceso</th>
                <th className="py-3.5 px-4">Fecha de Asignación</th>
                <th className="py-3.5 px-4 text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-900/15">
              {teamList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    No hay miembros de equipo con roles especiales configurados aún.
                  </td>
                </tr>
              ) : (
                teamList.map((member: any) => {
                  const profile = member.profiles || {}
                  const role = member.role

                  return (
                    <tr key={member.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                            {profile.email ? profile.email[0].toUpperCase() : 'M'}
                          </div>
                          <div>
                            <span className="font-bold text-white block">{profile.full_name || 'Personal RSD'}</span>
                            <span className="text-[11px] text-slate-400">{profile.email}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            role === 'admin'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : role === 'advisor'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          }`}
                        >
                          {role === 'admin' ? '🛡️ Administrador' : role === 'advisor' ? '👓 Asesor Comercial' : '🎧 Soporte'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-300 text-[11px]">
                        {role === 'admin' ? (
                          <span className="text-purple-300 font-semibold">Acceso Total (RSD Owner)</span>
                        ) : role === 'advisor' ? (
                          <span className="text-amber-300 font-semibold">Solo Lectura (Clientes & Eventos)</span>
                        ) : (
                          <span className="text-slate-400">Atención a Incidencias</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-slate-400">
                        {member.granted_at ? new Date(member.granted_at).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        }) : 'N/A'}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Habilitado</span>
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
