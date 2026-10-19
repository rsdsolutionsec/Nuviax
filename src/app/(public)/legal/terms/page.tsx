import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export const metadata = {
  title: 'Términos y Condiciones',
  description: 'Términos y condiciones de uso de la plataforma Nuviax de RSD SOLUTIONS.',
}

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#090714]">
      <Navbar />
      <main className="flex-1 py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-300">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">
          Términos y Condiciones de Uso
        </h1>
        <div className="space-y-6 text-sm leading-relaxed rsd-glow-card p-8 rounded-3xl border border-purple-900/30">
          <p>
            Bienvenido a <strong>Nuviax</strong>, un servicio desarrollado y administrado por <strong>RSD SOLUTIONS</strong>. Al acceder o utilizar nuestra plataforma de invitaciones digitales, aceptas cumplir con los siguientes términos y condiciones.
          </p>
          <h2 className="text-lg font-bold text-white pt-2">1. Objeto del Servicio</h2>
          <p>
            Nuviax proporciona a sus usuarios herramientas digitales para la creación, personalización, publicación bajo enlaces únicos y administración de confirmaciones de asistencia para celebraciones personales y familiares.
          </p>
          <h2 className="text-lg font-bold text-white pt-2">2. Vigencia y Expiración</h2>
          <p>
            Las invitaciones publicadas tienen un período de vigencia determinado por el plan adquirido (30, 90 o 180 días post-evento). Al finalizar dicho plazo, el evento pasará a estado expirado conmemorativo. El usuario puede solicitar la renovación o archivo desde su panel.
          </p>
          <h2 className="text-lg font-bold text-white pt-2">3. Contenido Permitido</h2>
          <p>
            El usuario es el único responsable de los textos, imágenes y enlaces cargados en sus invitaciones. Queda estrictamente prohibido cargar material que infrinja derechos de autor, sea difamatorio, fraudulento o atente contra la privacidad de terceros.
          </p>
          <h2 className="text-lg font-bold text-white pt-2">4. Pagos y Reembolsos</h2>
          <p>
            Los precios de los planes se cobran por evento de forma única. Una vez publicado el evento y activadas las funcionalidades interactivas, los reembolsos se evaluarán caso por caso dentro de los primeros 7 días si existió una falla técnica atribuible a la plataforma.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
