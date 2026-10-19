import { createClient } from '@/lib/supabase/server'
import { DollarSign, TrendingUp, CreditCard, AlertCircle, PieChart, ShieldCheck } from 'lucide-react'

export const metadata = {
  title: 'Finanzas & Métricas | Consola Nuviax',
  description: 'Balance operativo, ingresos brutos y desglose por planes contratados.',
}

export default async function AdminFinancesPage() {
  const supabase = await createClient()

  // Fetch orders with plan code
  const { data: orders = [] } = await supabase
    .from('orders')
    .select(`
      id,
      amount,
      status,
      created_at,
      plans(code, name)
    `)

  const completedOrders = (orders || []).filter((o: any) => o.status === 'completed')
  const totalGross = completedOrders.reduce((acc: number, curr: any) => acc + Number(curr.amount || 0), 0)

  // Estimated payment processing fee: 3.99% + $0.30 fixed fee per transaction
  const gatewayFees = completedOrders.reduce((acc: number, curr: any) => acc + (Number(curr.amount || 0) * 0.0399 + 0.30), 0)
  const netOperationalIncome = Math.max(0, totalGross - gatewayFees)

  // Plan breakdown
  const planSales = {
    essential: completedOrders.filter((o: any) => o.plans?.code === 'essential'),
    interactive: completedOrders.filter((o: any) => o.plans?.code === 'interactive'),
    pro: completedOrders.filter((o: any) => o.plans?.code === 'pro'),
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white">Métricas Financieras & Conciliación</h1>
        <p className="text-xs text-slate-400 mt-1">
          Análisis de volumen transaccional, comisiones de pasarela e ingresos operativos por plan.
        </p>
      </div>

      {/* Financial Formula Clarification Notice */}
      <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-900/30 flex items-start gap-3 text-xs text-slate-300">
        <AlertCircle className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white block">Criterio Financiero Oficial RSD SOLUTIONS:</span>
          <span className="text-slate-400 text-[11px] mt-0.5 block">
            El valor mostrado como "Ingreso Neto Operativo" corresponde a las ventas brutas cobradas menos la comisión estimada de pasarela de pagos (3.99% + $0.30 USD por cobro). No representa la utilidad neta contable de la empresa, la cual requiere deducir impuestos locales y costos de infraestructura en servidores.
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="rsd-glow-card p-6 rounded-2xl border border-purple-900/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Ventas Brutas Cobradas
            </span>
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-white mt-4">${totalGross.toFixed(2)}</p>
          <p className="text-[11px] text-slate-400 mt-1">{completedOrders.length} transacciones exitosas</p>
        </div>

        <div className="rsd-glow-card p-6 rounded-2xl border border-purple-900/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Comisión Estimada Pasarela
            </span>
            <CreditCard className="w-5 h-5 text-rose-400" />
          </div>
          <p className="text-3xl font-extrabold text-rose-300 mt-4">${gatewayFees.toFixed(2)}</p>
          <p className="text-[11px] text-slate-400 mt-1">Tarifa transaccional estimada</p>
        </div>

        <div className="rsd-glow-card p-6 rounded-2xl border border-purple-900/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Ingreso Neto Operativo
            </span>
            <TrendingUp className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-400 mt-4">${netOperationalIncome.toFixed(2)}</p>
          <p className="text-[11px] text-slate-400 mt-1">Margen disponible para operaciones</p>
        </div>
      </div>

      {/* Sales by Plan Table */}
      <div className="rsd-glow-card rounded-2xl border border-purple-900/30 overflow-hidden">
        <div className="p-5 border-b border-purple-900/20">
          <h2 className="text-sm font-bold text-white">Rendimiento Comercial por Tipo de Plan</h2>
          <p className="text-xs text-slate-400 mt-0.5">Distribución de compras por nivel de servicio</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0C081D] text-slate-400 uppercase tracking-wider text-[10px] border-b border-purple-900/20">
              <tr>
                <th className="py-3.5 px-4">Plan Comercial</th>
                <th className="py-3.5 px-4">Precio Oficial</th>
                <th className="py-3.5 px-4">Vigencia Post-Evento</th>
                <th className="py-3.5 px-4">Unidades Vendidas</th>
                <th className="py-3.5 px-4 text-right">Total Facturado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-900/15">
              <tr className="hover:bg-white/[0.02]">
                <td className="py-3.5 px-4 font-bold text-white">Plan Esencial</td>
                <td className="py-3.5 px-4 text-slate-300 font-mono">$19.99 USD</td>
                <td className="py-3.5 px-4 text-slate-400">30 días</td>
                <td className="py-3.5 px-4 font-bold text-white">{planSales.essential.length}</td>
                <td className="py-3.5 px-4 text-right font-extrabold text-emerald-400">
                  ${(planSales.essential.length * 19.99).toFixed(2)} USD
                </td>
              </tr>
              <tr className="hover:bg-white/[0.02]">
                <td className="py-3.5 px-4 font-bold text-purple-300">Plan Interactiva (Popular)</td>
                <td className="py-3.5 px-4 text-slate-300 font-mono">$29.99 USD</td>
                <td className="py-3.5 px-4 text-slate-400">90 días</td>
                <td className="py-3.5 px-4 font-bold text-white">{planSales.interactive.length}</td>
                <td className="py-3.5 px-4 text-right font-extrabold text-emerald-400">
                  ${(planSales.interactive.length * 29.99).toFixed(2)} USD
                </td>
              </tr>
              <tr className="hover:bg-white/[0.02]">
                <td className="py-3.5 px-4 font-bold text-pink-300">Plan Evento Pro</td>
                <td className="py-3.5 px-4 text-slate-300 font-mono">$49.99 USD</td>
                <td className="py-3.5 px-4 text-slate-400">180 días</td>
                <td className="py-3.5 px-4 font-bold text-white">{planSales.pro.length}</td>
                <td className="py-3.5 px-4 text-right font-extrabold text-emerald-400">
                  ${(planSales.pro.length * 49.99).toFixed(2)} USD
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
