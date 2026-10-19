'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Sparkles, Menu, X, ArrowRight } from 'lucide-react'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Nuviax'

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#090714]/85 border-b border-purple-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-fuchsia-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-purple-300 transition-colors">
                {appName}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-purple-400/80 font-medium -mt-1">
                RSD Solutions
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/catalog"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Catálogo de Diseños
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Planes & Precios
            </Link>
            <Link
              href="/faq"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Preguntas Frecuentes
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Contacto
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-300 hover:text-white px-4 py-2 rounded-lg hover:bg-white/5 transition-all"
            >
              Iniciar Sesión
            </Link>
            <Link
              href="/catalog"
              className="rsd-glow-button text-sm font-semibold text-white px-5 py-2.5 rounded-xl flex items-center gap-2"
            >
              <span>Crear Invitación</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-[#0D0B1F] border-b border-purple-900/30 px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/catalog"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-purple-900/20"
          >
            Catálogo de Diseños
          </Link>
          <Link
            href="/pricing"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-purple-900/20"
          >
            Planes & Precios
          </Link>
          <Link
            href="/faq"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-purple-900/20"
          >
            Preguntas Frecuentes
          </Link>
          <Link
            href="/contact"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-purple-900/20"
          >
            Contacto
          </Link>
          <div className="pt-4 border-t border-purple-900/20 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="w-full text-center py-2.5 rounded-lg text-slate-300 hover:bg-white/5 font-medium"
            >
              Iniciar Sesión
            </Link>
            <Link
              href="/catalog"
              onClick={() => setIsOpen(false)}
              className="w-full rsd-glow-button text-center py-2.5 rounded-xl text-white font-semibold flex items-center justify-center gap-2"
            >
              <span>Crear Invitación</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
