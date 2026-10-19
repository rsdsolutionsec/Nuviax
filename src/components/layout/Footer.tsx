import Link from 'next/link'
import { Sparkles, Heart, ShieldCheck, Mail, MapPin } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()
  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Nuviax'
  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || 'RSD SOLUTIONS'

  return (
    <footer className="w-full bg-[#070510] border-t border-purple-900/20 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                {appName}
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              La plataforma más sofisticada para crear, compartir y gestionar invitaciones digitales interactivas para momentos memorables.
            </p>
            <div className="flex items-center gap-2 text-xs text-purple-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Desarrollado y respaldado por {companyName}</span>
            </div>
          </div>

          {/* Categorías */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Celebraciones
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/catalog?cat=bodas" className="hover:text-purple-300 transition-colors">
                  Bodas & Compromisos
                </Link>
              </li>
              <li>
                <Link href="/catalog?cat=quinceaneras" className="hover:text-purple-300 transition-colors">
                  Quinceañeras & Sweet 16
                </Link>
              </li>
              <li>
                <Link href="/catalog?cat=cumpleanos-infantiles" className="hover:text-purple-300 transition-colors">
                  Cumpleaños Infantiles
                </Link>
              </li>
              <li>
                <Link href="/catalog?cat=cumpleanos-adultos" className="hover:text-purple-300 transition-colors">
                  Cumpleaños de Adultos
                </Link>
              </li>
              <li>
                <Link href="/catalog?cat=baby-shower" className="hover:text-purple-300 transition-colors">
                  Baby Showers & Bautizos
                </Link>
              </li>
            </ul>
          </div>

          {/* Plataforma */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Plataforma
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/catalog" className="hover:text-purple-300 transition-colors">
                  Explorar Plantillas
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-purple-300 transition-colors">
                  Planes & Tarifas
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-purple-300 transition-colors">
                  Preguntas Frecuentes
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-purple-300 transition-colors">
                  Acceso a Mi Panel
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-purple-300 transition-colors">
                  Soporte al Cliente
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal y Seguridad */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Legal & Privacidad
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/legal/terms" className="hover:text-purple-300 transition-colors">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="hover:text-purple-300 transition-colors">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/legal/retention" className="hover:text-purple-300 transition-colors">
                  Retención de Datos
                </Link>
              </li>
            </ul>
            <div className="mt-6 pt-4 border-t border-purple-900/20 text-xs text-slate-500">
              <p>Seguridad con cifrado SSL y políticas RLS de grado empresarial.</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-purple-900/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} {appName}. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1.5">
            Hecho con <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" /> por{' '}
            <span className="text-purple-300 font-semibold">{companyName}</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
