import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Mail, MessageCircle, Clock, ShieldCheck } from 'lucide-react'

export const metadata = {
  title: 'Contacto y Soporte',
  description: 'Canales de soporte y atención al cliente de Nuviax y RSD SOLUTIONS.',
}

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#090714]">
      <Navbar />
      <main className="flex-1 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-pink-400 uppercase tracking-widest">
              Estamos para ayudarte
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-2">
              Contacto y Soporte
            </h1>
            <p className="mt-4 text-slate-400 text-sm sm:text-base">
              Si tienes dudas sobre tus invitaciones, personalizaciones especiales o medios de pago, contáctanos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rsd-glow-card p-8 rounded-2xl border border-purple-900/30 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
                <Mail className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white">Atención por Correo</h2>
              <p className="text-sm text-slate-400">
                Escríbenos para consultas comerciales, facturación o soporte técnico en tu cuenta.
              </p>
              <p className="text-sm font-semibold text-purple-300">
                soporte@rsdsolutions.com
              </p>
            </div>

            <div className="rsd-glow-card p-8 rounded-2xl border border-purple-900/30 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white">Canal WhatsApp VIP</h2>
              <p className="text-sm text-slate-400">
                Asistencia rápida para clientes de los planes Interactiva y Evento Pro.
              </p>
              <p className="text-sm font-semibold text-emerald-400">
                +1 (800) RSD-NUVIAX
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
