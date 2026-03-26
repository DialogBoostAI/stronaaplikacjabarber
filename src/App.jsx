import { useState, useCallback } from 'react'
import haircuts from './data/haircuts.json'
import FormStep from './components/FormStep'
import LoadingOverlay from './components/LoadingOverlay'
import ResultsPage from './components/ResultsPage'

export const STEPS = [
  {
    key: 'faceShape',
    title: 'Jaki jest kształt Twojej twarzy?',
    options: [
      { value: 'owal',      label: 'Owal',       desc: 'Szerszy pośrodku, zwężony ku czołu i brodzie' },
      { value: 'kwadrat',   label: 'Kwadrat',    desc: 'Wyraźna szczęka, podobna szerokość i długość' },
      { value: 'okrągły',   label: 'Okrągły',    desc: 'Miękkie kontury, zbliżony do koła' },
      { value: 'serce',     label: 'Serce',       desc: 'Szersze czoło, wąska broda' },
      { value: 'prostokąt', label: 'Prostokąt',  desc: 'Długa twarz z prostymi, równoległymi bokami' },
      { value: 'diament',   label: 'Diament',    desc: 'Wąskie czoło i broda, szerokie kości policzkowe' },
    ],
  },
  {
    key: 'sideLength',
    title: 'Jaka jest aktualna długość boków?',
    options: [
      { value: 'do_skóry',       label: 'Do skóry',       desc: 'Ogolone na zero lub prawie zero' },
      { value: 'bardzo_krótkie', label: 'Bardzo krótkie', desc: 'Maszynka, kilka mm' },
      { value: 'krótkie',        label: 'Krótkie',        desc: '1–3 cm, widoczna tekstura' },
      { value: 'średnie',        label: 'Średnie',        desc: 'Powyżej 3 cm, zakrywają uszy' },
    ],
  },
  {
    key: 'fringeLength',
    title: 'Jaka jest aktualna długość włosów z przodu?',
    options: [
      { value: 'bardzo_krótkie', label: 'Bardzo krótkie', desc: 'Maszynka, ledwo widoczne' },
      { value: 'krótkie',        label: 'Krótkie',        desc: 'Kilka cm, nie sięgają czoła' },
      { value: 'średnie',        label: 'Średnie',        desc: 'Do brwi lub oczu' },
      { value: 'długie',         label: 'Długie',          desc: 'Poniżej oczu' },
    ],
  },
  {
    key: 'backLength',
    title: 'Jaka jest aktualna długość tyłu?',
    options: [
      { value: 'do_skóry',       label: 'Do skóry',       desc: 'Ogolone na zero' },
      { value: 'bardzo_krótkie', label: 'Bardzo krótkie', desc: 'Maszynka, kilka mm' },
      { value: 'krótkie',        label: 'Krótkie',        desc: 'Równo z bokami, 1–3 cm' },
      { value: 'średnie',        label: 'Średnie',        desc: '3–6 cm, lekko odstaje' },
      { value: 'długie',         label: 'Długie',          desc: 'Poniżej karku' },
    ],
  },
  {
    key: 'hairType',
    title: 'Jaki jest naturalny typ Twoich włosów?',
    options: [
      { value: 'proste',   label: 'Proste',   desc: 'Leżą płasko, bez naturalnych fal' },
      { value: 'falowane', label: 'Falowane', desc: 'Delikatne, naturalne fale' },
      { value: 'kręcone',  label: 'Kręcone',  desc: 'Wyraźne loki lub spirale' },
    ],
  },
  {
    key: 'hairThickness',
    title: 'Jaka jest grubość Twoich włosów?',
    options: [
      { value: 'cienkie',  label: 'Cienkie',  desc: 'Delikatne, niezbyt gęste' },
      { value: 'normalne', label: 'Normalne', desc: 'Średnia gęstość i grubość' },
      { value: 'grube',    label: 'Grube',    desc: 'Gęste, ciężkie włosy' },
    ],
  },
]

// Ranking: dłuższe = wyższy numer. Jeśli masz dłuższe niż minimum potrzebne → da się ściąć.
const SIDE_RANK   = { do_skóry: 0, bardzo_krótkie: 1, krótkie: 2, średnie: 3 }
const FRINGE_RANK = { bardzo_krótkie: 0, krótkie: 1, średnie: 2, długie: 3 }
const BACK_RANK   = { do_skóry: 0, bardzo_krótkie: 1, krótkie: 2, średnie: 3, długie: 4 }

function scoreLengthMatch(userValue, suitableValues, rankMap) {
  const userRank = rankMap[userValue]
  const minRequired = Math.min(...suitableValues.map(v => rankMap[v]))
  // Exact match — user's current length is one of the suitable lengths
  if (suitableValues.includes(userValue)) return 2
  // User has more hair than needed — can be cut, but not ideal fit
  if (userRank > Math.max(...suitableValues.map(v => rankMap[v]))) return 1
  // User has enough to reach at least the minimum
  if (userRank >= minRequired) return 1
  // Too short — can't achieve this haircut
  return 0
}

const MAX_SCORE = 9 // 3 binary (face/type/thickness) + 3 length x2

function scoreHaircut(haircut, formData) {
  let s = 0
  if (haircut.suitable_face_shapes.includes(formData.faceShape))          s++
  if (haircut.suitable_hair_types.includes(formData.hairType))            s++
  if (haircut.suitable_hair_thicknesses.includes(formData.hairThickness)) s++
  s += scoreLengthMatch(formData.sideLength,   haircut.suitable_side_lengths,   SIDE_RANK)
  s += scoreLengthMatch(formData.fringeLength,  haircut.suitable_fringe_lengths, FRINGE_RANK)
  s += scoreLengthMatch(formData.backLength,    haircut.suitable_back_lengths,   BACK_RANK)
  return s
}

export default function App() {
  const [screen, setScreen]           = useState('form')
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData]       = useState({
    faceShape: null, hairType: null, hairThickness: null, sideLength: null, fringeLength: null, backLength: null,
  })
  const [results, setResults]   = useState([])
  const [fading, setFading]     = useState(false)

  const handleSelect = useCallback((key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }, [])

  const handleNext = useCallback(() => setCurrentStep(s => s + 1), [])
  const handleBack = useCallback(() => setCurrentStep(s => s - 1), [])

  const handleSubmit = useCallback(() => {
    const scored = haircuts
      .map(h => ({ ...h, score: scoreHaircut(h, formData) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(h => ({ ...h, percentMatch: Math.round((h.score / MAX_SCORE) * 100) }))
    setResults(scored)
    setScreen('loading')
  }, [formData])

  const handleLoadingDone = useCallback(() => setScreen('results'), [])

  const handleReset = useCallback(() => {
    setFading(true)
    setTimeout(() => {
      setScreen('form')
      setCurrentStep(0)
      setFormData({ faceShape: null, hairType: null, hairThickness: null, sideLength: null, fringeLength: null, backLength: null })
      setResults([])
      setFading(false)
    }, 400)
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {screen === 'loading' && <LoadingOverlay onDone={handleLoadingDone} />}

      {screen === 'form' && (
        <div className={fading ? 'animate-fade-out' : 'animate-fade-in'}>
          <FormStep
            steps={STEPS}
            currentStep={currentStep}
            formData={formData}
            onSelect={handleSelect}
            onNext={handleNext}
            onBack={handleBack}
            onSubmit={handleSubmit}
          />
        </div>
      )}

      {screen === 'results' && (
        <div className={fading ? 'animate-fade-out' : ''}>
          <ResultsPage
            results={results}
            formData={formData}
            steps={STEPS}
            onReset={handleReset}
          />
        </div>
      )}
    </div>
  )
}
