import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import { HelpCircle, ChevronRight } from 'lucide-react'

export const metadata = {
  title: 'Preguntas Frecuentes',
  description: 'Respuestas a las preguntas más comunes sobre Nuviax, invitaciones digitales, RSVP y pagos.',
}

const FAQS = [
  {
    q: '¿Cómo reciben mis invitados la invitación?',
    a: 'Una vez publicada, obtienes un enlace público personalizado (por ejemplo, nuviax.com/ana-y-carlos). Solo debes copiar ese enlace y enviarlo por WhatsApp, Telegram, correo electrónico o redes sociales. La vista previa en WhatsApp mostrará automáticamente el título, foto de portada y descripción.',
  },
  {
    q: '¿Mis invitados necesitan descargar alguna aplicación o registrarse?',
    a: '¡No! Tus invitados simplemente hacen clic en el enlace desde su celular o computadora y la invitación se abrirá al instante en su navegador. La confirmación de asistencia (RSVP) se realiza con un toque sin pedirles contraseña ni registro.',
  },
  {
    q: '¿Puedo limitar el número de acompañantes por invitado?',
    a: 'Sí, en los planes Interactiva y Evento Pro puedes asignar un número exacto de pases o acompañantes permitidos por persona o grupo familiar. Al confirmar, el sistema no permitirá seleccionar más personas de las autorizadas.',
  },
  {
    q: '¿Qué sucede cuando se cumple la fecha de vencimiento?',
    a: 'La invitación entra en estado de expiración mostrando un mensaje elegante de agradecimiento conmemorando el evento. Puedes extender la vigencia en cualquier momento desde tu panel de usuario.',
  },
  {
    q: '¿Puedo editar los datos de la invitación después de haberla publicado?',
    a: 'Sí, todos los textos, itinerario, fotos de la galería y ubicación pueden editarse en cualquier momento desde tu panel sin cambiar el enlace que ya enviaste.',
  },
]

export default function FAQPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#090714]">
      <Navbar />
      <main className="flex-1 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-pink-400 uppercase tracking-widest">
              Centro de Ayuda
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-2">
              Preguntas Frecuentes
            </h1>
            <p className="mt-4 text-slate-400 text-sm sm:text-base">
              Resolvemos tus dudas sobre cómo crear, personalizar y compartir tu invitación digital.
            </p>
          </div>

          <div className="space-y-6">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="rsd-glow-card p-6 sm:p-8 rounded-2xl border border-purple-900/30"
              >
                <h3 className="text-lg font-bold text-white flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center text-xs font-mono">
                    {i + 1}
                  </span>
                  <span>{faq.q}</span>
                </h3>
                <p className="mt-3 text-sm text-slate-300 leading-relaxed pl-10">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center p-8 rounded-2xl bg-[#110D23] border border-purple-900/20">
            <h4 className="text-base font-bold text-white">¿Tienes otra consulta?</h4>
            <p className="text-xs text-slate-400 mt-1">
              Nuestro equipo de soporte está disponible para orientarte.
            </p>
            <div className="mt-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-xs font-semibold text-pink-400 hover:text-pink-300"
              >
                <span>Contáctanos directamente</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
