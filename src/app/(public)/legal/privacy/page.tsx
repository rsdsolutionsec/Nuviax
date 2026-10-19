import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export const metadata = {
  title: 'Política de Privacidad',
  description: 'Política de privacidad y protección de datos personales en Nuviax.',
}

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#090714]">
      <Navbar />
      <main className="flex-1 py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-300">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">
          Política de Privacidad
        </h1>
        <div className="space-y-6 text-sm leading-relaxed rsd-glow-card p-8 rounded-3xl border border-purple-900/30">
          <p>
            En <strong>Nuviax (RSD SOLUTIONS)</strong>, la protección de los datos personales de nuestros clientes y de sus invitados es una prioridad absoluta de arquitectura y diseño.
          </p>
          <h2 className="text-lg font-bold text-white pt-2">1. Información que Recopilamos</h2>
          <p>
            - Datos de la cuenta del anfitrión: nombre completo, correo electrónico y credenciales de acceso seguras.<br />
            - Datos del evento: fechas, nombres de homenajeados, ubicaciones geográficas y fotografías autorizadas.<br />
            - Datos de invitados: nombres, grupos familiares, confirmaciones RSVP, acompañantes autorizados y restricciones alimentarias proporcionadas voluntariamente.
          </p>
          <h2 className="text-lg font-bold text-white pt-2">2. Protección de Invitados (Aislamiento RLS)</h2>
          <p>
            Nuestras bases de datos PostgreSQL implementan políticas Row Level Security (RLS) estrictas. Las listas completas de invitados nunca se exponen al público ni a otros usuarios. Los invitados solo pueden responder a su propia invitación mediante tokens no predecibles o formularios de confirmación protegidos.
          </p>
          <h2 className="text-lg font-bold text-white pt-2">3. No Venta de Datos</h2>
          <p>
            RSD SOLUTIONS no vende, no comercializa ni comparte la información de anfitriones o invitados con terceros para fines publicitarios.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
