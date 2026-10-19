import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { TemplateRenderer } from '@/templates/TemplateRenderer'

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ t?: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = createAdminClient()

  const { data: event } = await supabase
    .from('events')
    .select('title, content_data, event_date')
    .eq('slug', slug)
    .maybeSingle()

  if (!event) {
    return {
      title: 'Invitación no encontrada | Nuviax',
    }
  }

  const content = (event.content_data as Record<string, any>) || {}
  const title = event.title
  const description =
    content.quote || `Estás cordialmente invitado a celebrar con nosotros este momento inolvidable.`
  const coverImage =
    content.gallery?.[0] ||
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'

  return {
    title: `${title} | Invitación Digital`,
    description,
    openGraph: {
      title: `${title} — Invitación Exclusiva`,
      description,
      images: [
        {
          url: coverImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [coverImage],
    },
  }
}

export default async function PublicInvitationPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { t: invitationToken } = await searchParams

  const supabase = createAdminClient()

  // 1. Fetch event
  const { data: event, error } = await supabase
    .from('events')
    .select('*, templates(*), plans(*)')
    .eq('slug', slug)
    .maybeSingle()

  // 2. Check slug redirects if not found
  if (!event) {
    const { data: redirectRecord } = await supabase
      .from('slug_redirects')
      .select('event_id, events(slug)')
      .eq('old_slug', slug)
      .maybeSingle()

    if (redirectRecord && (redirectRecord.events as any)?.slug) {
      redirect(`/${(redirectRecord.events as any).slug}`)
    }

    notFound()
  }

  // 3. Handle expired events
  const isExpired =
    event.status === 'expired' ||
    (event.expires_at && new Date(event.expires_at) < new Date())

  if (isExpired) {
    return (
      <div className="min-h-screen bg-[#090714] flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full rsd-glow-card p-10 rounded-3xl space-y-4">
          <div className="w-16 h-16 rounded-full bg-purple-600/20 text-purple-400 flex items-center justify-center mx-auto">
            <span className="text-2xl">✨</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Evento Concluido</h1>
          <p className="text-sm text-slate-300">
            La celebración de <span className="font-semibold text-purple-300">{event.title}</span> ya se ha llevado a cabo.
          </p>
          <p className="text-xs text-slate-500">
            Agradecemos a todos los familiares y amigos que nos acompañaron y compartieron este momento especial con nosotros.
          </p>
        </div>
      </div>
    )
  }

  // 4. Fetch guest details if personal token is present
  let guestInfo: { name: string; authorizedCompanions: number } | undefined = undefined
  if (invitationToken) {
    const { data: guest } = await supabase
      .from('guests')
      .select('first_name, last_name, authorized_companions')
      .eq('invitation_token', invitationToken)
      .eq('event_id', event.id)
      .maybeSingle()

    if (guest) {
      guestInfo = {
        name: `${guest.first_name} ${guest.last_name || ''}`.trim(),
        authorizedCompanions: guest.authorized_companions,
      }
    }
  }

  return (
    <TemplateRenderer
      event={event}
      guest={guestInfo}
      invitationToken={invitationToken}
    />
  )
}
