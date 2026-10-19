import { createClient } from '@/lib/supabase/server'
import { Receipt, Search, CheckCircle2, Clock, AlertCircle, DollarSign, Shield } from 'lucide-react'

export const metadata = {
  title: 'Órdenes & Transacciones | Consola Nuviax',
  description: 'Historial de pagos, órdenes comerciales y conciliación de pasarelas.',
}

export default async function AdminOrdersPage() {
  const supabase = await createClient()

  // Fetch orders with profiles, plans, events
  const { data: orders = [] } = await supabase
    .from('orders')
    .select(`
      id,
      amount,
      currency,
      status,
      created_at,
      profiles(email, full_name),
      plans(name, code),
      events(title, slug)
    `)
    .order('created_at', { ascending: false })

  const ordersList = orders || []

  const totalAmount = ordersList
    .filter((o: any) => o.status === 'completed')
    .reduce((acc: number, curr: any) => acc + Number(curr.amount || 0), 0)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Órdenes & Historial de Pagos</h1>
          <p className="text-xs text-slate-400 mt-1">
            Registro transaccional de compras únicas, activaciones de planes y conciliación financiera.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-emerald-400" />
          <span>${totalAmount.toFixed(2)} USD Facturado</span>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rsd-glow-card rounded-2xl border border-purple-900/30 overflow-hidden">
        <div className="p-5 border-b border-purple-900/20 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">Registro de Transacciones Comerciales</h2>
          <span className="text-xs text-slate-400 font-mono">{ordersList.length} Órdenes Registradas</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0C081D] text-slate-400 uppercase tracking-wider text-[10px] border-b border-purple-900/20">
              <tr>
                <th className="py-3.5 px-4">ID de Orden</th>
                <th className="py-3.5 px-4">Cliente</th>
                <th className="py-3.5 px-4">Invitación Asociada</th>
                <th className="py-3.5 px-4">Plan Adquirido</th>
                <th className="py-3.5 px-4">Importe</th>
                <th className="py-3.5 px-4">Fecha</th>
                <th className="py-3.5 px-4 text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-900/15">
              {ordersList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No se han registrado órdenes comerciales aún.
                  </td>
                </tr>
              ) : (
                ordersList.map((order: any) => {
                  const isCompleted = order.status === 'completed'
                  const isPending = order.status === 'pending'

                  return (
                    <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4 font-mono text-[11px] text-purple-400">
                        {order.id.substring(0, 13)}...
                      </td>

                      <td className="py-3.5 px-4 text-slate-300">
                        <span className="font-semibold text-white block">{order.profiles?.full_name || 'Cliente'}</span>
                        <span className="text-[11px] text-slate-400">{order.profiles?.email}</span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-300">
                        <span className="font-semibold text-white block">{order.events?.title || 'Invitación'}</span>
                        <span className="text-[10px] text-purple-400 font-mono">/{order.events?.slug}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-purple-300">
                          {order.plans?.name || 'Esencial'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-extrabold text-white">
                        ${Number(order.amount).toFixed(2)} <span className="text-[10px] text-slate-400 font-normal">{order.currency}</span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-400">
                        {new Date(order.created_at).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isCompleted
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : isPending
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          <span>{order.status}</span>
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
