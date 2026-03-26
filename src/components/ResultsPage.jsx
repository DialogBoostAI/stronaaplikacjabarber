import { useRef } from 'react'
import HaircutCard from './HaircutCard'

export default function ResultsPage({ results, formData, steps, onReset }) {
  const btnRef = useRef(null)

  function handleRipple(e) {
    const btn  = btnRef.current
    if (!btn) return
    const rect = btn.getBoundingClientRect()
    const x    = e.clientX - rect.left
    const y    = e.clientY - rect.top

    const ripple = document.createElement('span')
    ripple.style.cssText = `
      position: absolute;
      left: ${x}px; top: ${y}px;
      width: 10px; height: 10px;
      margin: -5px;
      border-radius: 50%;
      background: rgba(255,255,255,0.35);
      pointer-events: none;
      animation: ripple 0.6s ease-out forwards;
    `
    btn.appendChild(ripple)
    ripple.addEventListener('animationend', () => ripple.remove())
  }

  // Build summary of user selections
  const summary = steps.map(step => {
    const selected = formData[step.key]
    const opt      = step.options.find(o => o.value === selected)
    return { label: step.title.split('?')[0].replace('Jaki jest ', '').replace('Jaka jest ', ''), value: opt?.label }
  })

  const bestScore = results[0]?.percentMatch ?? 0

  return (
    <div className="min-h-screen px-4 py-12 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <p className="text-amber-400 font-semibold tracking-widest uppercase text-sm mb-2">Wyniki analizy</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Twoje najlepsze fryzury
        </h1>
        <p className="text-gray-500 text-sm">
          {bestScore >= 75
            ? `Świetnie! Znaleźliśmy fryzury dopasowane w ${bestScore}% do Twoich cech.`
            : 'Znaleźliśmy najlepiej pasujące fryzury — częściowe dopasowanie.'
          }
        </p>

        {/* Selection summary pills */}
        <div className="flex flex-wrap justify-center gap-2 mt-5">
          {summary.map(({ label, value }) => value && (
            <span key={label} className="text-xs px-3 py-1 bg-gray-800 text-gray-400 rounded-full">
              {value}
            </span>
          ))}
        </div>
      </div>

      {/* Results cards */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-1">
        {results.map((haircut, i) => (
          <HaircutCard
            key={haircut.id}
            haircut={haircut}
            index={i}
            formData={formData}
            steps={steps}
          />
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-3 mt-12">
        <button
          ref={btnRef}
          onMouseDown={handleRipple}
          onClick={onReset}
          className="relative overflow-hidden px-8 py-4 rounded-xl border-2 border-amber-400 text-amber-400 font-semibold text-base hover:bg-amber-400 hover:text-gray-950 transition-all duration-300 hover:shadow-[0_4px_24px_rgba(251,191,36,0.3)] active:scale-95"
        >
          ↺ Zacznij od nowa
        </button>
        <a
          href="https://ostryjakbrzytwa.vercel.app/"
          className="px-8 py-4 rounded-xl border-2 border-gray-600 text-gray-400 font-semibold text-base text-center hover:border-gray-400 hover:text-white transition-all duration-300 active:scale-95"
        >
          ← Wróć na stronę
        </a>
      </div>

      {/* Footer note */}
      <p className="text-center text-gray-700 text-xs mt-8">
        Wyniki mają charakter inspiracyjny. Skonsultuj się z fryzjerem przed zmianą fryzury.
      </p>
    </div>
  )
}
