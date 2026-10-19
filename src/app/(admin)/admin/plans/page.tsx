import { createClient } from '@/lib/supabase/server'
import { ShieldCheck, Calendar, Sparkles, CheckCircle2, AlertCircle, Clock, ShieldAlert } from 'lucide-react'

export const metadata = {
  title: 'Planes & Excepciones Administrativas | Consola Nuviax',
  description: 'Matriz comercial de planes, límites de producto y registro de excepciones auditadas.',
}

export default async function AdminPlansPage() {
  const supabase = await createClient()

  // Fetch plans from database
  const { data: plans = [] } = await supabase
    .from('plans')
    .select('*')
    .order('price', { ascending: true })

  // Fetch admin exceptions log
  const { data: exceptions = [] } = await supabase
    .from('admin_exceptions')
    .select(`
      id,
      action_type,
      reason,
      created_at,
      expires_at,
      events(title, slug),
      profiles:admin_id(email)
    `)
    .order('created_at', { ascending: false })
    .limit(10)

  const plansList = plans || []
  const exceptionsList = exceptions || []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white">Planes Comerciales & Excepciones</h1>
        <p className="text-xs text-slate-400 mt-1">
          Configuración centralizada de niveles de servicio, vigencias post-evento y auditoría de excepciones manuales.
        </p>
      </div>

      {/* Rules Notice */}
      <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-900/30 flex items-start gap-3 text-xs text-slate-300">
        <ShieldAlert className="w-4 h-4 text-pink-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white block">Regla de Inmutabilidad de Órdenes Históricas:</span>
          <span className="text-slate-400 text-[11px] mt-0.5 block">
            Cada compra registrada en Nuviax guarda una instantánea (snapshot) del precio y condiciones contratadas. Cualquier cambio futuro en los precios del catálogo no afectará órdenes ni vigencias previas. En esta versión V1 no se admiten suscripciones mensuales recurrentes (pago único por evento).
          </span>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(plans || []).map((plan: any) => {
          const isInteractive = plan.code === 'interactive'
          const isPro = plan.code === 'pro'

          return (
            <div
              key={plan.id}
              className={`p-6 rounded-2xl border flex flex-col justify-between ${
                isInteractive
                  ? 'bg-gradient-to-b from-[#1C1338] to-[#110D24] border-fuchsia-500/50 shadow-xl shadow-purple-600/10'
                  : 'bg-[#110D23] border-purple-900/30'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg text-white">{plan.name}</h3>
                  <span className="text-[10px] font-mono uppercase bg-white/5 border border-white/10 px-2 py-0.5 rounded text-purple-300">
                    {plan.code}
                  </span>
                </div>

                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-extrabold text-white">${Number(plan.price).toFixed(2)}</span>
                  <span className="text-xs text-slate-400 ml-1">USD / evento</span>
                </div>

                <p className="text-xs text-purple-300 font-medium mt-2">
                  Vigencia: {plan.duration_days} días posteriores al evento
                </p>

                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {plan.description}
                </p>

                <div className="mt-6 pt-4 border-t border-purple-900/20 space-y-2 text-xs text-slate-300">
                  <div className="flex items-center justify-between">
                    <span>Confirmación RSVP:</span>
                    <span className="font-bold text-white">
                      {plan.features?.allow_rsvp ? (plan.features?.allow_advanced_rsvp ? 'Avanzado' : 'Básico') : 'No incluido'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Música de fondo:</span>
                    <span className="font-bold text-white">
                      {plan.features?.allow_music ? 'Sí (con pausa)' : 'No'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Límite de fotos:</span>
                    <span className="font-bold text-white">
                      {plan.features?.max_photos || 1} fotos
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Exportación CSV:</span>
                    <span className="font-bold text-white">
                      {plan.features?.export_guests ? 'Permitido' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Admin Exceptions Audit Table */}
      <div className="rsd-glow-card rounded-2xl border border-purple-900/30 overflow-hidden">
        <div className="p-5 border-b border-purple-900/20 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white">Registro de Excepciones Comerciales Auditadas</h2>
            <p className="text-xs text-slate-400 mt-0.5">Ampliaciones manuales de vigencia o facultades extraordinarias</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">Tabla admin_exceptions</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0C081D] text-slate-400 uppercase tracking-wider text-[10px] border-b border-purple-900/20">
              <tr>
                <th className="py-3.5 px-4">Evento Beneficiado</th>
                <th className="py-3.5 px-4">Tipo de Acción</th>
                <th className="py-3.5 px-4">Motivo Documentado</th>
                <th className="py-3.5 px-4">Administrador</th>
                <th className="py-3.5 px-4">Fecha</th>
                <th className="py-3.5 px-4 text-right">Expiración</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-900/15">
              {exceptionsList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-500">
                    No se han emitido excepciones administrativas manuales. El sistema opera 100% sobre las reglas comerciales estándar.
                  </td>
                </tr>
              ) : (
                exceptionsList.map((exc: any) => (
                  <tr key={exc.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">
                      {exc.events?.title || 'Evento'}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-purple-400">
                      {exc.action_type}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {exc.reason}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {exc.profiles?.email || 'Admin'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {new Date(exc.created_at).toLocaleDateString('es-ES')}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-400">
                      {exc.expires_at ? new Date(exc.expires_at).toLocaleDateString('es-ES') : 'Permanente'}
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
