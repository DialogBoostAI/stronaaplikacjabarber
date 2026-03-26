import { useState } from 'react'

const CRITERIA_LABELS = {
  faceShape:     'Kształt twarzy',
  hairType:      'Typ włosów',
  hairThickness: 'Grubość włosów',
  sideLength:    'Boki',
  fringeLength:  'Przód',
  backLength:    'Tył',
}

const SIDE_RANK   = { do_skóry: 0, bardzo_krótkie: 1, krótkie: 2, średnie: 3 }
const FRINGE_RANK = { bardzo_krótkie: 0, krótkie: 1, średnie: 2, długie: 3 }
const BACK_RANK   = { do_skóry: 0, bardzo_krótkie: 1, krótkie: 2, średnie: 3, długie: 4 }

function canAchieve(userValue, suitableValues, rankMap) {
  const userRank = rankMap[userValue]
  const minRequired = Math.min(...suitableValues.map(v => rankMap[v]))
  return userRank >= minRequired
}

export default function HaircutCard({ haircut, index, formData, steps }) {
  const [imgLoaded, setImgLoaded]   = useState(false)
  const [imgError, setImgError]     = useState(false)

  const { name, description, percentMatch, score, image_path, tags } = haircut
  const isPartial = percentMatch < 75

  // Check each criterion
  const criteria = [
    { key: 'faceShape',     match: haircut.suitable_face_shapes.includes(formData.faceShape) },
    { key: 'hairType',      match: haircut.suitable_hair_types.includes(formData.hairType) },
    { key: 'hairThickness', match: haircut.suitable_hair_thicknesses.includes(formData.hairThickness) },
    { key: 'sideLength',    match: canAchieve(formData.sideLength,   haircut.suitable_side_lengths,   SIDE_RANK) },
    { key: 'fringeLength',  match: canAchieve(formData.fringeLength,  haircut.suitable_fringe_lengths, FRINGE_RANK) },
    { key: 'backLength',    match: canAchieve(formData.backLength,    haircut.suitable_back_lengths,   BACK_RANK) },
  ]

  return (
    <div
      className="animate-slide-up bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 flex flex-col"
      style={{ animationDelay: `${index * 150}ms`, opacity: 0, animationFillMode: 'forwards' }}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-800 overflow-hidden">
        {!imgError ? (
          <img
            src={image_path}
            alt={name}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            className={`w-full h-full object-cover transition-all duration-700 ${
              imgLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'
            }`}
          />
        ) : null}

        {/* Placeholder when no image */}
        {(imgError || !imgLoaded) && (
          <div className={`absolute inset-0 flex flex-col items-center justify-center text-gray-600 ${imgLoaded && !imgError ? 'opacity-0' : 'opacity-100'}`}>
            <PlaceholderScissors />
            <span className="text-xs mt-2 text-gray-600">Brak zdjęcia</span>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent" />

        {/* % Badge */}
        <div
          className={`absolute top-3 right-3 animate-pop-in px-3 py-1 rounded-full text-sm font-bold text-gray-950 ${
            isPartial ? 'bg-gray-400' : 'bg-amber-400'
          }`}
          style={{ animationDelay: `${index * 150 + 300}ms`, animationFillMode: 'both' }}
        >
          {percentMatch}%
        </div>

        {/* Partial match badge */}
        {isPartial && (
          <div className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold bg-gray-700 text-gray-300">
            częściowe dopasowanie
          </div>
        )}

        {/* Rank */}
        {!isPartial && index === 0 && (
          <div className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-bold bg-amber-400 text-gray-950">
            ★ Najlepsza
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 gap-4">
        {/* Name + Tags */}
        <div>
          <h2 className="text-xl font-bold text-white mb-2">{name}</h2>
          <div className="flex flex-wrap gap-1.5">
            {tags.map(tag => (
              <span key={tag} className="text-xs px-2 py-0.5 bg-gray-800 text-gray-400 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-400 text-sm leading-relaxed">{description}</p>

        {/* Criteria checkmarks */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-800">
          {criteria.map(({ key, match }) => (
            <div key={key} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                match ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-800 text-gray-600'
              }`}>
                {match ? (
                  <svg width="8" height="7" viewBox="0 0 8 7" fill="none">
                    <path d="M1 3.5L3 5.5L7 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M2 2L6 6M6 2L2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                )}
              </div>
              <span className={`text-xs ${match ? 'text-gray-300' : 'text-gray-600'}`}>
                {CRITERIA_LABELS[key]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function PlaceholderScissors() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="6" r="3"/>
      <circle cx="6" cy="18" r="3"/>
      <line x1="20" y1="4" x2="8.12" y2="15.88"/>
      <line x1="14.47" y1="14.48" x2="20" y2="20"/>
      <line x1="8.12" y1="8.12" x2="12" y2="12"/>
    </svg>
  )
}
