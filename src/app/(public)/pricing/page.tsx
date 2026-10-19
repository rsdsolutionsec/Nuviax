import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import { CheckCircle2, HelpCircle } from 'lucide-react'

export const metadata = {
  title: 'Planes & Precios',
  description: 'Conoce los planes de Nuviax para invitaciones digitales: Esencial, Interactiva y Evento Pro.',
}

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#090714]">
      <Navbar />
      <main className="flex-1 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-pink-400 uppercase tracking-widest">
              Tarifas Claras & Sin Sorpresas
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mt-2">
              Elige el plan ideal para tu evento
            </h1>
            <p className="mt-4 text-slate-400 text-base">
              Pago único por evento. Sin suscripciones recurrentes ni costos sorpresa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
            {/* Esencial */}
            <div className="rounded-2xl p-8 bg-[#110D23] border border-purple-900/30 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Esencial</h2>
                <p className="text-xs text-slate-400 mt-1">Anuncios elegantes y celebraciones íntimas</p>
                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-extrabold text-white">$19.99</span>
                  <span className="text-xs text-slate-400 ml-2">USD pago único</span>
                </div>
                <div className="mt-8 pt-6 border-t border-purple-900/20">
                  <ul className="space-y-3.5 text-sm text-slate-300">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-purple-400" />
                      <span>URL legible única (ej: nuviax.com/evento)</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-purple-400" />
                      <span>Ubicación y mapa interactivo</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-purple-400" />
                      <span>Vista previa optimizada para WhatsApp</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-purple-400" />
                      <span>30 días de vigencia post-evento</span>
                    </li>
                  </ul>
                </div>
              </div>
              <Link
                href="/catalog?plan=essential"
                className="mt-8 w-full py-3.5 rounded-xl text-center text-sm font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              >
                Comenzar con Esencial
              </Link>
            </div>

            {/* Interactiva */}
            <div className="rounded-2xl p-8 bg-gradient-to-b from-[#1E143C] to-[#120E24] border-2 border-fuchsia-500 shadow-2xl shadow-purple-600/20 relative flex flex-col justify-between">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white text-[11px] font-bold uppercase tracking-wider">
                Recomendado
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Interactiva</h2>
                <p className="text-xs text-purple-300 mt-1">La experiencia completa que sorprenderá a todos</p>
                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-extrabold text-white">$29.99</span>
                  <span className="text-xs text-slate-400 ml-2">USD pago único</span>
                </div>
                <div className="mt-8 pt-6 border-t border-purple-900/20">
                  <ul className="space-y-3.5 text-sm text-slate-200">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-pink-400" />
                      <span>Todo lo del Plan Esencial</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-pink-400" />
                      <span>Confirmación de asistencia (RSVP)</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-pink-400" />
                      <span>Cuenta regresiva y música ambiental</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-pink-400" />
                      <span>Galería fotográfica (hasta 8 fotos)</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-pink-400" />
                      <span>Itinerario y mesa de regalos</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-pink-400" />
                      <span>90 días de vigencia post-evento</span>
                    </li>
                  </ul>
                </div>
              </div>
              <Link
                href="/catalog?plan=interactive"
                className="mt-8 w-full rsd-glow-button py-3.5 rounded-xl text-center text-sm font-bold text-white shadow-lg"
              >
                Comenzar con Interactiva
              </Link>
            </div>

            {/* Evento Pro */}
            <div className="rounded-2xl p-8 bg-[#110D23] border border-purple-900/30 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Evento Pro</h2>
                <p className="text-xs text-slate-400 mt-1">Control integral de invitados para grandes celebraciones</p>
                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-extrabold text-white">$49.99</span>
                  <span className="text-xs text-slate-400 ml-2">USD pago único</span>
                </div>
                <div className="mt-8 pt-6 border-t border-purple-900/20">
                  <ul className="space-y-3.5 text-sm text-slate-300">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-purple-400" />
                      <span>Todo lo del Plan Interactivo</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-purple-400" />
                      <span>Panel VIP de invitados con filtros y notas</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-purple-400" />
                      <span>Control de acompañantes y menú dietario</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-purple-400" />
                      <span>Exportación de lista a Excel / CSV</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-purple-400" />
                      <span>Galería ampliada (hasta 24 fotos)</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-purple-400" />
                      <span>180 días de vigencia y sin marca de agua</span>
                    </li>
                  </ul>
                </div>
              </div>
              <Link
                href="/catalog?plan=event_pro"
                className="mt-8 w-full py-3.5 rounded-xl text-center text-sm font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              >
                Comenzar con Evento Pro
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
