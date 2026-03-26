import { useEffect, useRef } from 'react'

const FACE_SHAPE_IMAGES = {
  owal:      'images/faces/oval.jpg',
  kwadrat:   'images/faces/square.jpg',
  okrągły:   'images/faces/round.webp',
  serce:     'images/faces/heart.jpg',
  prostokąt: 'images/faces/rectangle.jpg',
  diament:   'images/faces/diamond.jpg',
}

const SIDE_LENGTH_ICONS = {
  do_skóry:       <SideSkin />,
  bardzo_krótkie: <SideVShort />,
  krótkie:        <SideShort />,
  średnie:        <SideMedium />,
}

const FRINGE_ICONS = {
  bardzo_krótkie: <FringeVShort />,
  krótkie:        <FringeShort />,
  średnie:        <FringeMedium />,
  długie:         <FringeLong />,
}

const BACK_LENGTH_ICONS = {
  do_skóry:       <BackSkin />,
  bardzo_krótkie: <BackVShort />,
  krótkie:        <BackShort />,
  średnie:        <BackMedium />,
  długie:         <BackLong />,
}

const HAIR_TYPE_ICONS = {
  proste:   <HairStraight />,
  falowane: <HairWavy />,
  kręcone:  <HairCurly />,
}

const HAIR_THICKNESS_ICONS = {
  cienkie:  <ThickThin />,
  normalne: <ThickNormal />,
  grube:    <ThickThick />,
}

function getIcon(stepKey, value) {
  if (stepKey === 'faceShape')     return null // handled separately with images
  if (stepKey === 'hairType')      return HAIR_TYPE_ICONS[value]
  if (stepKey === 'hairThickness') return HAIR_THICKNESS_ICONS[value]
  if (stepKey === 'sideLength')    return SIDE_LENGTH_ICONS[value]
  if (stepKey === 'fringeLength')  return FRINGE_ICONS[value]
  if (stepKey === 'backLength')    return BACK_LENGTH_ICONS[value]
  return null
}

function getFaceImage(value) {
  return FACE_SHAPE_IMAGES[value] || null
}

export default function FormStep({ steps, currentStep, formData, onSelect, onNext, onBack, onSubmit }) {
  const step      = steps[currentStep]
  const selected  = formData[step.key]
  const isLast    = currentStep === steps.length - 1
  const canNext   = selected !== null
  const wrapRef   = useRef(null)

  useEffect(() => {
    if (wrapRef.current) {
      wrapRef.current.classList.remove('animate-slide-in-right')
      void wrapRef.current.offsetWidth // force reflow
      wrapRef.current.classList.add('animate-slide-in-right')
    }
  }, [currentStep])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Header */}
      <div className="w-full max-w-2xl mb-8 text-center">
        <div className="flex justify-center gap-2 mb-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-500 ${
                i <= currentStep ? 'bg-amber-400 w-10' : 'bg-gray-700 w-6'
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-amber-400 font-semibold tracking-widest uppercase mb-2">
          Krok {currentStep + 1} z {steps.length}
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
          {step.title}
        </h1>
      </div>

      {/* Cards grid */}
      <div ref={wrapRef} className="w-full max-w-2xl animate-slide-in-right">
        <div className={`grid gap-3 ${step.options.length <= 4 ? 'grid-cols-2 sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-3'}`}>
          {step.options.map(opt => {
            const isSelected = selected === opt.value
            return (
              <button
                key={opt.value}
                onClick={() => onSelect(step.key, opt.value)}
                className={`
                  group relative flex flex-col items-center gap-3 p-5 rounded-2xl border-2 text-center
                  transition-all duration-200 cursor-pointer
                  ${isSelected
                    ? 'border-amber-400 bg-amber-400/10 -translate-y-1 shadow-[0_8px_32px_rgba(251,191,36,0.25)]'
                    : 'border-gray-700 bg-gray-900 hover:border-gray-500 hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-lg'
                  }
                `}
              >
                {/* Icon or face image */}
                {step.key === 'faceShape' ? (
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 transition-colors duration-200 flex-shrink-0"
                    style={{ borderColor: isSelected ? '#fbbf24' : 'transparent' }}>
                    <img
                      src={getFaceImage(opt.value)}
                      alt={opt.label}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className={`w-14 h-14 flex items-center justify-center rounded-xl transition-colors duration-200 ${
                    isSelected ? 'text-amber-400' : 'text-gray-400 group-hover:text-gray-200'
                  }`}>
                    {getIcon(step.key, opt.value)}
                  </div>
                )}

                <div>
                  <div className={`font-semibold text-sm sm:text-base transition-colors ${isSelected ? 'text-amber-400' : 'text-white'}`}>
                    {opt.label}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 leading-snug">{opt.desc}</div>
                </div>

                {/* Checkmark */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center animate-pop-in">
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-8 w-full max-w-2xl">
        {currentStep > 0 && (
          <button
            onClick={onBack}
            className="flex-1 py-3 px-6 rounded-xl border border-gray-700 text-gray-300 font-semibold hover:border-gray-500 hover:text-white transition-all duration-200"
          >
            ← Wstecz
          </button>
        )}
        <button
          onClick={isLast ? onSubmit : onNext}
          disabled={!canNext}
          className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
            canNext
              ? 'bg-amber-400 text-gray-950 hover:bg-amber-300 hover:shadow-[0_4px_20px_rgba(251,191,36,0.4)] active:scale-95'
              : 'bg-gray-800 text-gray-600 cursor-not-allowed'
          }`}
        >
          {isLast ? 'Znajdź fryzury ✂️' : 'Dalej →'}
        </button>
      </div>
    </div>
  )
}

/* ── SVG Icons ────────────────────────────────────────────── */

function FaceOval() {
  return (
    <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-full h-full">
      <ellipse cx="28" cy="28" rx="14" ry="20" />
      <line x1="28" y1="8" x2="28" y2="12" strokeWidth="1.5" opacity="0.4"/>
      <line x1="28" y1="44" x2="28" y2="48" strokeWidth="1.5" opacity="0.4"/>
    </svg>
  )
}
function FaceSquare() {
  return (
    <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-full h-full">
      <rect x="12" y="8" width="32" height="40" rx="5"/>
    </svg>
  )
}
function FaceRound() {
  return (
    <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-full h-full">
      <circle cx="28" cy="28" r="20"/>
    </svg>
  )
}
function FaceHeart() {
  return (
    <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-full h-full">
      <path d="M28 46 C28 46 8 30 8 18 C8 12 13 8 19 10 C23 11 26 14 28 16 C30 14 33 11 37 10 C43 8 48 12 48 18 C48 30 28 46 28 46Z"/>
    </svg>
  )
}
function FaceRect() {
  return (
    <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-full h-full">
      <rect x="14" y="5" width="28" height="46" rx="4"/>
    </svg>
  )
}
function FaceDiamond() {
  return (
    <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-full h-full">
      <polygon points="28,4 46,28 28,52 10,28"/>
    </svg>
  )
}

/* ── Side Length Icons ──────────────────────────────────── */

function SideSkin() {
  return (
    <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-full h-full">
      <ellipse cx="28" cy="26" rx="14" ry="18" />
      <path d="M20 14 Q28 6 36 14" fill="currentColor" opacity="0.35"/>
    </svg>
  )
}
function SideVShort() {
  return (
    <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-full h-full">
      <ellipse cx="28" cy="26" rx="14" ry="18" />
      <path d="M16 22 Q16 10 28 8 Q40 10 40 22" fill="currentColor" opacity="0.25"/>
      <line x1="15" y1="20" x2="17" y2="22" strokeWidth="1.5" opacity="0.5"/>
      <line x1="41" y1="20" x2="39" y2="22" strokeWidth="1.5" opacity="0.5"/>
    </svg>
  )
}
function SideShort() {
  return (
    <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-full h-full">
      <ellipse cx="28" cy="26" rx="14" ry="18" />
      <path d="M14 24 Q14 8 28 6 Q42 8 42 24" fill="currentColor" opacity="0.25"/>
      <path d="M13 20 Q11 22 12 26" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
      <path d="M43 20 Q45 22 44 26" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
    </svg>
  )
}
function SideMedium() {
  return (
    <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-full h-full">
      <ellipse cx="28" cy="26" rx="14" ry="18" />
      <path d="M12 28 Q12 8 28 5 Q44 8 44 28" fill="currentColor" opacity="0.25"/>
      <path d="M11 18 Q8 24 9 32" strokeWidth="3" strokeLinecap="round" opacity="0.5"/>
      <path d="M45 18 Q48 24 47 32" strokeWidth="3" strokeLinecap="round" opacity="0.5"/>
    </svg>
  )
}

/* ── Fringe Icons ──────────────────────────────────────── */

function FringeVShort() {
  return (
    <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-full h-full">
      <ellipse cx="28" cy="28" rx="14" ry="18" />
      <path d="M18 18 Q28 12 38 18" strokeWidth="2" strokeLinecap="round"/>
      <path d="M22 16 Q28 8 34 16" strokeWidth="2" opacity="0.4" strokeLinecap="round"/>
    </svg>
  )
}
function FringeShort() {
  return (
    <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-full h-full">
      <ellipse cx="28" cy="28" rx="14" ry="18" />
      <path d="M18 18 L22 14 L26 17 L30 13 L34 16 L38 18" strokeWidth="2" strokeLinecap="round" fill="currentColor" opacity="0.2"/>
    </svg>
  )
}
function FringeMedium() {
  return (
    <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-full h-full">
      <ellipse cx="28" cy="28" rx="14" ry="18" />
      <path d="M16 20 Q18 10 24 12 Q26 8 30 12 Q34 9 36 14 Q40 12 40 20" strokeWidth="2" strokeLinecap="round" fill="currentColor" opacity="0.2"/>
    </svg>
  )
}
function FringeLong() {
  return (
    <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-full h-full">
      <ellipse cx="28" cy="28" rx="14" ry="18" />
      <path d="M14 24 Q16 8 24 10 Q26 4 30 10 Q34 6 36 12 Q42 8 42 24" strokeWidth="2" strokeLinecap="round" fill="currentColor" opacity="0.25"/>
      <path d="M18 20 Q20 26 16 30" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
    </svg>
  )
}

/* ── Back Length Icons ─────────────────────────────────── */

function BackSkin() {
  return (
    <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-full h-full">
      <ellipse cx="28" cy="24" rx="14" ry="16" />
      <path d="M20 12 Q28 4 36 12" fill="currentColor" opacity="0.3"/>
      <rect x="22" y="40" width="12" height="8" rx="2" opacity="0.4"/>
    </svg>
  )
}
function BackVShort() {
  return (
    <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-full h-full">
      <ellipse cx="28" cy="24" rx="14" ry="16" />
      <path d="M18 14 Q28 4 38 14" fill="currentColor" opacity="0.3"/>
      <rect x="22" y="40" width="12" height="8" rx="2" opacity="0.4"/>
      <line x1="24" y1="38" x2="24" y2="41" strokeWidth="1.5" opacity="0.4"/>
      <line x1="28" y1="38" x2="28" y2="41" strokeWidth="1.5" opacity="0.4"/>
      <line x1="32" y1="38" x2="32" y2="41" strokeWidth="1.5" opacity="0.4"/>
    </svg>
  )
}
function BackShort() {
  return (
    <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-full h-full">
      <ellipse cx="28" cy="24" rx="14" ry="16" />
      <path d="M16 16 Q28 4 40 16" fill="currentColor" opacity="0.3"/>
      <rect x="22" y="40" width="12" height="8" rx="2" opacity="0.4"/>
      <path d="M22 38 Q22 44 20 46" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
      <path d="M34 38 Q34 44 36 46" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
    </svg>
  )
}
function BackMedium() {
  return (
    <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-full h-full">
      <ellipse cx="28" cy="22" rx="14" ry="16" />
      <path d="M16 14 Q28 2 40 14" fill="currentColor" opacity="0.3"/>
      <rect x="22" y="38" width="12" height="8" rx="2" opacity="0.4"/>
      <path d="M20 36 Q18 44 19 50" strokeWidth="3" strokeLinecap="round" opacity="0.5"/>
      <path d="M36 36 Q38 44 37 50" strokeWidth="3" strokeLinecap="round" opacity="0.5"/>
    </svg>
  )
}
function BackLong() {
  return (
    <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-full h-full">
      <ellipse cx="28" cy="20" rx="14" ry="15" />
      <path d="M16 12 Q28 0 40 12" fill="currentColor" opacity="0.3"/>
      <path d="M18 32 Q16 42 18 54" strokeWidth="4" strokeLinecap="round" opacity="0.5"/>
      <path d="M38 32 Q40 42 38 54" strokeWidth="4" strokeLinecap="round" opacity="0.5"/>
      <path d="M24 34 Q24 44 26 52" strokeWidth="3" strokeLinecap="round" opacity="0.35"/>
      <path d="M32 34 Q32 44 30 52" strokeWidth="3" strokeLinecap="round" opacity="0.35"/>
    </svg>
  )
}

function HairStraight() {
  return (
    <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-full h-full">
      {[14, 22, 30, 38].map(x => (
        <line key={x} x1={x} y1="8" x2={x} y2="48" strokeLinecap="round"/>
      ))}
    </svg>
  )
}
function HairWavy() {
  return (
    <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-full h-full">
      {[0, 1, 2, 3].map(i => (
        <path key={i}
          d={`M${8 + i*12} 8 C${8+i*12} 20 ${14+i*12} 20 ${14+i*12} 28 C${14+i*12} 36 ${8+i*12} 36 ${8+i*12} 48`}
          strokeLinecap="round"
        />
      ))}
    </svg>
  )
}
function HairCurly() {
  return (
    <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-full h-full">
      <path d="M14 12 C14 20 24 20 24 12 C24 4 34 4 34 12 C34 20 44 20 44 12" strokeLinecap="round"/>
      <path d="M10 28 C10 36 20 36 20 28 C20 20 30 20 30 28 C30 36 40 36 40 28" strokeLinecap="round"/>
      <path d="M14 44 C14 52 24 52 24 44 C24 36 34 36 34 44" strokeLinecap="round"/>
    </svg>
  )
}

function ThickThin() {
  return (
    <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" className="w-full h-full">
      {[14, 22, 30, 38].map(x => (
        <line key={x} x1={x} y1="8" x2={x} y2="48" strokeWidth="1" strokeLinecap="round"/>
      ))}
    </svg>
  )
}
function ThickNormal() {
  return (
    <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" className="w-full h-full">
      {[14, 22, 30, 38].map(x => (
        <line key={x} x1={x} y1="8" x2={x} y2="48" strokeWidth="2.5" strokeLinecap="round"/>
      ))}
    </svg>
  )
}
function ThickThick() {
  return (
    <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" className="w-full h-full">
      {[14, 22, 30, 38].map(x => (
        <line key={x} x1={x} y1="8" x2={x} y2="48" strokeWidth="5" strokeLinecap="round"/>
      ))}
    </svg>
  )
}
