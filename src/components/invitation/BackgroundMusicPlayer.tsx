'use client'

import { useState, useRef } from 'react'
import { Volume2, VolumeX, Music, Play, Pause } from 'lucide-react'

interface MusicPlayerProps {
  musicUrl?: string
  musicTitle?: string
}

export function BackgroundMusicPlayer({
  musicUrl = 'https://assets.mixkit.co/music/preview/mixkit-romantic-wedding-piano-589.mp3',
  musicTitle = 'Música Ambiental',
}: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true)
      }).catch((err) => {
        console.warn('Playback prevented:', err)
      })
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <audio ref={audioRef} src={musicUrl} loop preload="none" />

      <button
        onClick={togglePlay}
        aria-label={isPlaying ? 'Pausar música' : 'Reproducir música'}
        className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full backdrop-blur-xl border shadow-2xl transition-all duration-300 ${
          isPlaying
            ? 'bg-purple-600/90 border-purple-400 text-white shadow-purple-600/40 animate-pulse'
            : 'bg-black/75 border-white/20 text-slate-300 hover:text-white hover:bg-black/90'
        }`}
      >
        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isPlaying ? 'animate-spin' : ''}`}>
          <Music className="w-3.5 h-3.5 text-pink-300" />
        </div>

        <span className="text-xs font-semibold max-w-[130px] truncate hidden sm:inline">
          {isPlaying ? musicTitle : 'Música'}
        </span>

        {isPlaying ? (
          <Volume2 className="w-4 h-4 text-emerald-300" />
        ) : (
          <Play className="w-3.5 h-3.5 text-slate-400 fill-slate-400" />
        )}
      </button>
    </div>
  )
}
