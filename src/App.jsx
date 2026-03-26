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
    key: 'hairType',
    title: 'Jaki jest naturalny typ Twoich włosów?',
    options: [
      { value: 'proste',   label: 'Proste',   desc: 'Leżą płasko, bez naturalnych fal' },
      { value: 'falowane', label: 'Falowane', desc: 'Delikatne, naturalne fale' },
      { value: 'kręcone',  label: 'Kręcone',  desc: 'Wyraźne loki lub spirale' },
    ],
  },
  {
    key: 'sideLength',
    title: 'Jak krótkie chcesz mieć boki?',
    options: [
      { value: 'do_skóry',       label: 'Do skóry',       desc: 'Ogolone na zero' },
      { value: 'bardzo_krótkie', label: 'Bardzo krótkie', desc: 'Maszynka, kilka mm' },
      { value: 'krótkie',        label: 'Krótkie',        desc: '1–3 cm, widoczna tekstura' },
      { value: 'średnie',        label: 'Średnie',        desc: 'Powyżej 3 cm, zakrywają uszy' },
    ],
  },
  {
    key: 'fringeLength',
    title: 'Jak długie włosy chcesz mieć z przodu?',
    options: [
      { value: 'bardzo_krótkie', label: 'Bardzo krótkie', desc: 'Maszynka, ledwo widoczne' },
      { value: 'krótkie',        label: 'Krótkie',        desc: 'Kilka cm, nie sięgają czoła' },
      { value: 'średnie',        label: 'Średnie',        desc: 'Do brwi lub oczu' },
      { value: 'długie',         label: 'Długie',          desc: 'Poniżej oczu' },
    ],
  },
  {
    key: 'backLength',
    title: 'Jak długie włosy chcesz mieć z tyłu?',
    options: [
      { value: 'do_skóry',       label: 'Do skóry',       desc: 'Ogolone na zero' },
      { value: 'bardzo_krótkie', label: 'Bardzo krótkie', desc: 'Maszynka, kilka mm' },
      { value: 'krótkie',        label: 'Krótkie',        desc: '1–3 cm' },
      { value: 'średnie',        label: 'Średnie',        desc: '3–6 cm' },
      { value: 'długie',         label: 'Długie',          desc: 'Poniżej karku' },
    ],
  },
  {
    key: 'stylingTime',
    title: 'Ile czasu rano poświęcasz na włosy?',
    options: [
      { value: 'none',          label: 'Nie chcę się stylizować', desc: 'Umyć i iść' },
      { value: 'minimal',       label: '5 minut',                 desc: 'Szybka stylizacja, odrobina produktu' },
      { value: 'likes_styling', label: 'Lubię się stylizować',    desc: 'Chętnie poświęcam czas na włosy' },
    ],
  },
]

const SIDE_RANK   = { do_skóry: 0, bardzo_krótkie: 1, krótkie: 2, średnie: 3 }
const FRINGE_RANK = { bardzo_krótkie: 0, krótkie: 1, średnie: 2, długie: 3 }
const BACK_RANK   = { do_skóry: 0, bardzo_krótkie: 1, krótkie: 2, średnie: 3, długie: 4 }

// 1.0 = exact match, 0.5 = one step away, 0 = far off
function scoreLengthPref(userPref, suitableValues, rankMap) {
  if (suitableValues.includes(userPref)) return 1.0
  const userRank = rankMap[userPref]
  const closestDist = Math.min(...suitableValues.map(v => Math.abs(rankMap[v] - userRank)))
  if (closestDist === 1) return 0.5
  return 0
}

function scoreHaircut(haircut, formData) {
  // Twarda eliminacja: typ włosów musi pasować
  if (!haircut.suitable_hair_types.includes(formData.hairType)) return -1

  let score = 0

  // Kształt twarzy: 50 pkt (najważniejsze — fizjologia)
  if (haircut.suitable_face_shapes.includes(formData.faceShape)) score += 50

  // Preferencje długości: 30 pkt (10 za boki, 10 za przód, 10 za tył)
  score += scoreLengthPref(formData.sideLength,   haircut.suitable_side_lengths,   SIDE_RANK)   * 10
  score += scoreLengthPref(formData.fringeLength,  haircut.suitable_fringe_lengths, FRINGE_RANK) * 10
  score += scoreLengthPref(formData.backLength,    haircut.suitable_back_lengths,   BACK_RANK)   * 10

  // Czas stylizacji: 20 pkt
  if (haircut.styling_time.includes(formData.stylingTime)) score += 20

  return score
}

export default function App() {
  const [screen, setScreen]           = useState('form')
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData]       = useState({
    faceShape: null, hairType: null, sideLength: null, fringeLength: null, backLength: null, stylingTime: null,
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
      .filter(h => h.score >= 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(h => ({ ...h, percentMatch: h.score }))
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
