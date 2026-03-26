import { useEffect, useState } from 'react'

const MESSAGES = [
  'Analizuję kształt twarzy...',
  'Przeglądam fryzury...',
  'Dopasowuję styl...',
]

export default function LoadingOverlay({ onDone }) {
  const [msgIndex, setMsgIndex] = useState(0)
  const [visible, setVisible]   = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex(i => (i + 1) % MESSAGES.length)
    }, 1000)

    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onDone, 400)
    }, 3000)

    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  }, [onDone])

  return (
    <div
      className={`fixed inset-0 z-50 bg-gray-950 flex flex-col items-center justify-center transition-opacity duration-400 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Orbit system */}
      <div className="relative w-48 h-48 flex items-center justify-center mb-10">
        {/* Orbiting icon 1 – Scissors */}
        <div className="absolute inset-0 animate-orbit" style={{ animationDuration: '4s' }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-counter-orbit" style={{ animationDuration: '4s' }}>
            <ScissorsIcon />
          </div>
        </div>

        {/* Orbiting icon 2 – Comb */}
        <div className="absolute inset-0 animate-orbit" style={{ animationDuration: '5s', animationDelay: '-1.67s' }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-counter-orbit" style={{ animationDuration: '5s', animationDelay: '-1.67s' }}>
            <CombIcon />
          </div>
        </div>

        {/* Orbiting icon 3 – Mirror */}
        <div className="absolute inset-0 animate-orbit" style={{ animationDuration: '6s', animationDelay: '-3.33s' }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-counter-orbit" style={{ animationDuration: '6s', animationDelay: '-3.33s' }}>
            <MirrorIcon />
          </div>
        </div>

        {/* Central spinning SVG head */}
        <div className="animate-spin-head w-24 h-24">
          <BarberHead />
        </div>
      </div>

      {/* Message */}
      <p className="text-amber-400 font-semibold text-lg mb-6 min-h-[1.75rem] transition-opacity duration-300">
        {MESSAGES[msgIndex]}
      </p>

      {/* Progress bar */}
      <div className="w-64 h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full bg-amber-400 rounded-full animate-progress-fill" />
      </div>
    </div>
  )
}

/* ── SVG Icons ─────────────────────────────────────────────── */

function ScissorsIcon() {
  return (
    <div className="w-10 h-10 bg-gray-900 border border-gray-700 rounded-full flex items-center justify-center shadow-lg">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="6" r="3"/>
        <circle cx="6" cy="18" r="3"/>
        <line x1="20" y1="4" x2="8.12" y2="15.88"/>
        <line x1="14.47" y1="14.48" x2="20" y2="20"/>
        <line x1="8.12" y1="8.12" x2="12" y2="12"/>
      </svg>
    </div>
  )
}

function CombIcon() {
  return (
    <div className="w-10 h-10 bg-gray-900 border border-gray-700 rounded-full flex items-center justify-center shadow-lg">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round">
        <rect x="2" y="9" width="20" height="6" rx="2"/>
        <line x1="6"  y1="9" x2="6"  y2="5"/>
        <line x1="10" y1="9" x2="10" y2="4"/>
        <line x1="14" y1="9" x2="14" y2="5"/>
        <line x1="18" y1="9" x2="18" y2="4"/>
      </svg>
    </div>
  )
}

function MirrorIcon() {
  return (
    <div className="w-10 h-10 bg-gray-900 border border-gray-700 rounded-full flex items-center justify-center shadow-lg">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round">
        <ellipse cx="12" cy="9" rx="6" ry="7"/>
        <line x1="12" y1="16" x2="12" y2="20"/>
        <line x1="9"  y1="20" x2="15" y2="20"/>
      </svg>
    </div>
  )
}

function BarberHead() {
  return (
    <svg viewBox="0 0 96 96" fill="none" className="w-full h-full">
      {/* Face */}
      <ellipse cx="48" cy="50" rx="26" ry="32" fill="#1f2937" stroke="#f59e0b" strokeWidth="2.5"/>
      {/* Hair */}
      <path d="M22 44 C20 28 28 16 48 14 C68 16 76 28 74 44 C68 36 58 30 48 30 C38 30 28 36 22 44Z" fill="#f59e0b" opacity="0.8"/>
      {/* Eyes */}
      <ellipse cx="38" cy="48" rx="3.5" ry="4" fill="#f59e0b"/>
      <ellipse cx="58" cy="48" rx="3.5" ry="4" fill="#f59e0b"/>
      {/* Nose */}
      <path d="M46 56 Q48 60 50 56" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round"/>
      {/* Beard */}
      <path d="M30 64 Q34 76 48 78 Q62 76 66 64 Q60 70 48 70 Q36 70 30 64Z" fill="#f59e0b" opacity="0.6"/>
      {/* Razor line accent */}
      <line x1="44" y1="16" x2="52" y2="16" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  )
}
