import Link from 'next/link'
import { Sparkles, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#090714] text-[#F8FAFC] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full rsd-glow-card p-10 rounded-3xl space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center mx-auto">
          <Sparkles className="w-8 h-8" />
        </div>
        <div>
          <span className="text-4xl font-extrabold text-white font-mono">404</span>
          <h1 className="text-2xl font-bold text-white mt-2">
            Invitación o Página No Encontrada
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            El enlace que intentas abrir no existe, ha cambiado de dirección o aún no ha sido publicado por los anfitriones.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/"
            className="rsd-glow-button inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Ir al Inicio de Nuviax</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
