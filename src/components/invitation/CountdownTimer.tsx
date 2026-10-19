'use client'

import { useState, useEffect } from 'react'

interface CountdownProps {
  targetDate: string
}

export function CountdownTimer({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(targetDate) - +new Date()
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTime()
    const timer = setInterval(calculateTime, 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto text-center">
      <div className="p-3 sm:p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 shadow-lg">
        <span className="block text-2xl sm:text-3xl font-extrabold text-white font-mono">
          {String(timeLeft.days).padStart(2, '0')}
        </span>
        <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider font-semibold">
          Días
        </span>
      </div>
      <div className="p-3 sm:p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 shadow-lg">
        <span className="block text-2xl sm:text-3xl font-extrabold text-white font-mono">
          {String(timeLeft.hours).padStart(2, '0')}
        </span>
        <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider font-semibold">
          Horas
        </span>
      </div>
      <div className="p-3 sm:p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 shadow-lg">
        <span className="block text-2xl sm:text-3xl font-extrabold text-white font-mono">
          {String(timeLeft.minutes).padStart(2, '0')}
        </span>
        <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider font-semibold">
          Min
        </span>
      </div>
      <div className="p-3 sm:p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 shadow-lg">
        <span className="block text-2xl sm:text-3xl font-extrabold text-pink-400 font-mono">
          {String(timeLeft.seconds).padStart(2, '0')}
        </span>
        <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider font-semibold">
          Seg
        </span>
      </div>
    </div>
  )
}
