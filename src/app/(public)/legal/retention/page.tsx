import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export const metadata = {
  title: 'Política de Retención de Datos',
  description: 'Lineamientos de retención, archivo y eliminación segura de datos de eventos.',
}

export default function RetentionPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#090714]">
      <Navbar />
      <main className="flex-1 py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-300">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">
          Política de Retención y Eliminación de Datos
        </h1>
        <div className="space-y-6 text-sm leading-relaxed rsd-glow-card p-8 rounded-3xl border border-purple-900/30">
          <p>
            Esta política establece los plazos y condiciones bajo los cuales <strong>RSD SOLUTIONS</strong> conserva o elimina la información de eventos creados en la plataforma <strong>Nuviax</strong>.
          </p>
          <h2 className="text-lg font-bold text-white pt-2">1. Período Activo</h2>
          <p>
            Durante la vigencia del plan contratado (30, 90 o 180 días posteriores a la fecha del evento), todos los datos, respuestas de invitados y fotos permanecen totalmente accesibles para el anfitrión y los invitados.
          </p>
          <h2 className="text-lg font-bold text-white pt-2">2. Período de Gracia Post-Vencimiento</h2>
          <p>
            Al vencer el plazo del plan, la invitación se muestra en modo conmemorativo por 60 días adicionales, durante los cuales el anfitrión puede descargar su lista de invitados o renovar la publicación.
          </p>
          <h2 className="text-lg font-bold text-white pt-2">3. Solicitud de Eliminación Inmediata</h2>
          <p>
            Cualquier anfitrión puede solicitar la eliminación total e irrevocable de su evento y de la lista de invitados en cualquier momento desde su panel de control o contactando a soporte técnico.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
