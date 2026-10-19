import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import {
  Sparkles,
  Heart,
  Clock,
  Music,
  Users,
  Share2,
  CheckCircle2,
  Smartphone,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react'

export default function HomePage() {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Nuviax'

  return (
    <div className="flex flex-col min-h-screen bg-[#090714]">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32">
          {/* Subtle background glow orbs */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-purple-600/15 rounded-full blur-[130px] pointer-events-none" />
          <div className="absolute top-1/3 left-3/4 -translate-y-1/2 w-[350px] h-[250px] bg-pink-600/15 rounded-full blur-[110px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-8 shadow-inner shadow-purple-500/10">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span>Plataforma SaaS de Invitaciones Digitales</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.12]">
              Tu celebración merece una invitación{' '}
              <span className="rsd-gradient-text">inolvidable</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              Elige un diseño de alta gama, personaliza cada detalle en minutos, compártela por WhatsApp con tu propio enlace y administra las confirmaciones en tiempo real.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/catalog"
                className="w-full sm:w-auto rsd-glow-button text-white font-bold px-8 py-4 rounded-xl text-base flex items-center justify-center gap-2.5"
              >
                <span>Explorar Diseños Disponibles</span>
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link
                href="/pricing"
                className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              >
                Ver Planes & Precios
              </Link>
            </div>

            {/* Metric proof counters */}
            <div className="mt-16 pt-10 border-t border-purple-900/20 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div>
                <p className="text-3xl font-extrabold text-white">100%</p>
                <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Optimizado Móvil</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold rsd-gradient-text">Instantáneo</p>
                <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Confirmación RSVP</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-white">Único</p>
                <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Enlace Personalizado</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-pink-400">0 App</p>
                <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Sin descargas para invitados</p>
              </div>
            </div>
          </div>
        </section>

        {/* VALUE PROPOSITION GRID */}
        <section className="py-20 bg-[#0C091D]/70 border-y border-purple-900/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-xs font-bold text-pink-400 uppercase tracking-widest mb-3">
                ¿Por qué elegir {appName}?
              </h2>
              <p className="text-3xl sm:text-4xl font-extrabold text-white">
                Todo lo que necesitas para tu evento en un solo lugar
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="rsd-glow-card p-8 rounded-2xl relative overflow-hidden group hover:border-purple-500/40 transition-all">
                <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  URL Legible y Exclusiva
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Nada de códigos extraños o UUIDs. Tu evento tendrá un enlace limpio como{' '}
                  <span className="text-purple-300 font-mono text-xs">nuviax.com/ana-y-carlos</span>, listo para compartir por WhatsApp con portada automática.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="rsd-glow-card p-8 rounded-2xl relative overflow-hidden group hover:border-pink-500/40 transition-all">
                <div className="w-12 h-12 rounded-xl bg-pink-600/20 text-pink-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Confirmación RSVP en Vivo
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Tus invitados confirman su asistencia con un solo toque desde su celular, indicando acompañantes y restricciones alimentarias sin crear cuentas.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="rsd-glow-card p-8 rounded-2xl relative overflow-hidden group hover:border-indigo-500/40 transition-all">
                <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Experiencia Interactiva Total
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Cuenta regresiva al segundo, mapa interactivo a la iglesia y recepción, itinerario del evento, música de fondo y mesa de regalos con un clic.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* TEMPLATES PREVIEW SHOWCASE */}
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">
                Colección Exclusiva
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
                Diseños para cada ocasión especial
              </h2>
            </div>
            <Link
              href="/catalog"
              className="mt-4 md:mt-0 text-sm font-semibold text-pink-400 hover:text-pink-300 flex items-center gap-1.5"
            >
              <span>Ver todas las categorías</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Boda */}
            <div className="group rounded-2xl overflow-hidden bg-[#120E24] border border-purple-900/30 hover:border-purple-500/50 transition-all">
              <div className="relative h-64 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80"
                  alt="Invitación Boda Elegance Gold"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[11px] font-semibold text-amber-300 uppercase tracking-wider border border-amber-500/20">
                  Bodas & Compromisos
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                  Elegance Gold
                </h3>
                <p className="text-sm text-slate-400 mt-2 line-clamp-2">
                  Acentos dorados, tipografía romana clásica, itinerario formal y confirmación personalizada.
                </p>
                <div className="mt-5 pt-4 border-t border-purple-900/20 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Incluye RSVP + Música</span>
                  <Link
                    href="/catalog/boda-elegance-gold"
                    className="text-xs font-bold text-pink-400 hover:text-pink-300"
                  >
                    Ver Demostración →
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 2: Quinceañera */}
            <div className="group rounded-2xl overflow-hidden bg-[#120E24] border border-purple-900/30 hover:border-pink-500/50 transition-all">
              <div className="relative h-64 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80"
                  alt="Invitación Quinceañera Glam Sparkle"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[11px] font-semibold text-pink-300 uppercase tracking-wider border border-pink-500/20">
                  Quinceañeras
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-white group-hover:text-pink-300 transition-colors">
                  Glam Sparkle XV
                </h3>
                <p className="text-sm text-slate-400 mt-2 line-clamp-2">
                  Tonalidades magenta y violeta neón con partículas luminosas y control de acompañantes.
                </p>
                <div className="mt-5 pt-4 border-t border-purple-900/20 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Galería + Cuenta Regresiva</span>
                  <Link
                    href="/catalog/quince-glam-sparkle"
                    className="text-xs font-bold text-pink-400 hover:text-pink-300"
                  >
                    Ver Demostración →
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 3: Fiesta Adultos */}
            <div className="group rounded-2xl overflow-hidden bg-[#120E24] border border-purple-900/30 hover:border-indigo-500/50 transition-all">
              <div className="relative h-64 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80"
                  alt="Invitación Fiesta Neon Cocktails"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[11px] font-semibold text-cyan-300 uppercase tracking-wider border border-cyan-500/20">
                  Cumpleaños & Fiestas
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Neon Fest & Cocktails
                </h3>
                <p className="text-sm text-slate-400 mt-2 line-clamp-2">
                  Estilo moderno para celebraciones especiales con geolocalización directa a Uber y Google Maps.
                </p>
                <div className="mt-5 pt-4 border-t border-purple-900/20 flex items-center justify-between">
                  <span className="text-xs text-slate-400">RSVP + Mapa Interactivo</span>
                  <Link
                    href="/catalog/cumple-neon-fest"
                    className="text-xs font-bold text-pink-400 hover:text-pink-300"
                  >
                    Ver Demostración →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING PLANS SECTION */}
        <section className="py-24 bg-[#0A0718] border-t border-purple-900/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold text-pink-400 uppercase tracking-widest">
                Transparencia Total
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-2">
                Planes adaptados a tu celebración
              </h2>
              <p className="mt-4 text-slate-400 text-sm sm:text-base">
                Sin suscripciones ocultas. Un único pago por evento con publicación garantizada y soporte.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              {/* Plan 1: Esencial */}
              <div className="rounded-2xl p-8 bg-[#110D23] border border-purple-900/30 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">Esencial</h3>
                  <p className="text-xs text-slate-400 mt-1">Para anuncios rápidos y celebraciones íntimas</p>
                  <div className="mt-6 flex items-baseline">
                    <span className="text-4xl font-extrabold text-white">$19.99</span>
                    <span className="text-xs text-slate-400 ml-2">USD / evento</span>
                  </div>
                  <ul className="mt-8 space-y-3.5 text-sm text-slate-300">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-purple-400" />
                      <span>URL única con tu nombre</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-purple-400" />
                      <span>Información del evento y ubicación</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-purple-400" />
                      <span>30 días de vigencia post-evento</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-purple-400" />
                      <span>Portada lista para WhatsApp</span>
                    </li>
                  </ul>
                </div>
                <Link
                  href="/catalog?plan=essential"
                  className="mt-10 w-full py-3 rounded-xl text-center text-sm font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                >
                  Elegir Esencial
                </Link>
              </div>

              {/* Plan 2: Interactiva (Destacado) */}
              <div className="rounded-2xl p-8 bg-gradient-to-b from-[#1C1338] to-[#120E24] border-2 border-fuchsia-500 shadow-xl shadow-purple-600/20 relative flex flex-col justify-between">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white text-[11px] font-bold uppercase tracking-wider shadow-md">
                  Más Popular
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Interactiva</h3>
                  <p className="text-xs text-purple-300 mt-1">La experiencia completa con música y RSVP</p>
                  <div className="mt-6 flex items-baseline">
                    <span className="text-4xl font-extrabold text-white">$29.99</span>
                    <span className="text-xs text-slate-400 ml-2">USD / evento</span>
                  </div>
                  <ul className="mt-8 space-y-3.5 text-sm text-slate-200">
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
                      <span>Cuenta regresiva y música de fondo</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-pink-400" />
                      <span>Galería fotográfica (hasta 8 fotos)</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-pink-400" />
                      <span>90 días de vigencia post-evento</span>
                    </li>
                  </ul>
                </div>
                <Link
                  href="/catalog?plan=interactive"
                  className="mt-10 w-full rsd-glow-button py-3.5 rounded-xl text-center text-sm font-bold text-white shadow-lg"
                >
                  Elegir Interactiva
                </Link>
              </div>

              {/* Plan 3: Evento Pro */}
              <div className="rounded-2xl p-8 bg-[#110D23] border border-purple-900/30 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">Evento Pro</h3>
                  <p className="text-xs text-slate-400 mt-1">Gestión profesional de invitados y lista VIP</p>
                  <div className="mt-6 flex items-baseline">
                    <span className="text-4xl font-extrabold text-white">$49.99</span>
                    <span className="text-xs text-slate-400 ml-2">USD / evento</span>
                  </div>
                  <ul className="mt-8 space-y-3.5 text-sm text-slate-300">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-purple-400" />
                      <span>Todo lo del Plan Interactivo</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-purple-400" />
                      <span>Panel avanzado de invitados y estadísticas</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-purple-400" />
                      <span>Control de acompañantes y restricciones</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-purple-400" />
                      <span>Exportación de lista a CSV/Excel</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-purple-400" />
                      <span>Galería ampliada (hasta 24 fotos)</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-purple-400" />
                      <span>180 días de vigencia sin marca de agua</span>
                    </li>
                  </ul>
                </div>
                <Link
                  href="/catalog?plan=event_pro"
                  className="mt-10 w-full py-3 rounded-xl text-center text-sm font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                >
                  Elegir Evento Pro
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CALL TO ACTION BANNER */}
        <section className="py-20 relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl p-10 sm:p-14 bg-gradient-to-r from-purple-900/60 via-fuchsia-900/50 to-purple-900/60 border border-purple-500/30 text-center relative overflow-hidden backdrop-blur-md shadow-2xl">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                ¿Listo para crear la invitación perfecta?
              </h2>
              <p className="mt-4 text-purple-200 text-sm sm:text-base max-w-xl mx-auto">
                No necesitas conocimientos de diseño ni programación. Escoge una plantilla, ingresa los datos de tu evento y publícala hoy mismo.
              </p>
              <div className="mt-8">
                <Link
                  href="/catalog"
                  className="inline-flex items-center gap-2.5 rsd-glow-button text-white font-bold px-8 py-4 rounded-xl text-base shadow-xl"
                >
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                  <span>Comenzar Ahora</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
