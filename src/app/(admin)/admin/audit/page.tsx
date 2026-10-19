import { createClient } from '@/lib/supabase/server'
import { History, Shield, Search, Filter, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react'

export const metadata = {
  title: 'Registro de Auditoría | Consola Nuviax',
  description: 'Trazabilidad de eventos críticos, accesos administrativos y cambios en el sistema.',
}

export default async function AdminAuditPage() {
  const supabase = await createClient()

  // Query audit_logs joined with profiles
  const { data: logs = [] } = await supabase
    .from('audit_logs')
    .select(`
      id,
      action,
      resource_type,
      resource_id,
      details,
      ip_address,
      created_at,
      profiles:user_id(email, full_name)
    `)
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Registro de Auditoría & Trazabilidad</h1>
          <p className="text-xs text-slate-400 mt-1">
            Historial inmutable de operaciones sensibles, cambios de roles, excepciones de vigencia e integraciones.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-purple-900/30 border border-purple-800/40 text-purple-300 text-xs font-semibold flex items-center gap-2">
          <History className="w-4 h-4 text-pink-400" />
          <span>Últimos 50 Eventos Registrados</span>
        </div>
      </div>

      {/* Security standard summary */}
      <div className="p-4 rounded-xl bg-[#110D24] border border-purple-900/30 text-xs text-slate-300 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>
            <strong>Cumplimiento de Privacidad:</strong> Los logs no contienen contraseñas, secretos de pasarela, tokens completos ni datos médicos de invitados.
          </span>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">Sanitizado</span>
      </div>

      {/* Audit Log Table */}
      <div className="rsd-glow-card rounded-2xl border border-purple-900/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0C081D] text-slate-400 uppercase tracking-wider text-[10px] border-b border-purple-900/20">
              <tr>
                <th className="py-3.5 px-4">Fecha y Hora</th>
                <th className="py-3.5 px-4">Operador / Usuario</th>
                <th className="py-3.5 px-4">Acción Auditada</th>
                <th className="py-3.5 px-4">Recurso / Entidad</th>
                <th className="py-3.5 px-4">Detalles Técnicos</th>
                <th className="py-3.5 px-4 text-right">Dirección IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-900/15">
              {(logs || []).length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No hay registros de auditoría recientes en la base de datos.
                  </td>
                </tr>
              ) : (
                (logs || []).map((log: any) => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>

                    <td className="py-3.5 px-4 text-slate-300">
                      {log.profiles?.email || 'Sistema Automático'}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-purple-300 font-mono text-[11px]">
                      {log.action}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-slate-300">
                        {log.resource_type}:{log.resource_id ? log.resource_id.substring(0, 8) : '*'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[10px] max-w-xs truncate">
                      {log.details ? JSON.stringify(log.details) : '—'}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-[11px] text-slate-500">
                      {log.ip_address || '127.0.0.1'}
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
