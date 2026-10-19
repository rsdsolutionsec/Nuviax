import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    template: `%s | ${process.env.NEXT_PUBLIC_APP_NAME || 'Nuviax'}`,
    default: `${process.env.NEXT_PUBLIC_APP_NAME || 'Nuviax'} — Invitaciones Digitales Personalizadas`,
  },
  description:
    'Crea, comparte y administra invitaciones digitales interactivas para bodas, cumpleaños, quinceañeras y eventos especiales. Diseños exclusivos y confirmación de asistencia en tiempo real.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    siteName: process.env.NEXT_PUBLIC_APP_NAME || 'Nuviax',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="dark h-full">
      <body className="min-h-full flex flex-col bg-[#090714] text-[#F8FAFC] antialiased selection:bg-purple-600 selection:text-white">
        {children}
      </body>
    </html>
  )
}
