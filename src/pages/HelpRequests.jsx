import { useEffect, useState } from 'react'
import logo from '../assets/logo.png'
import { loadHelpRequests } from '../utils/helpRequestStorage.js'
import './HelpRequests.css'

const CATEGORIES = [
  'Alle vragen',
  'Studie & vakken',
  'Stage',
  'Planning & motivatie',
  'Welzijn',
  'Loopbaan',
]

const CATEGORY_STYLES = {
  'Studie & vakken': { icon: '✎', color: 'orange' },
  Stage: { icon: '⚑', color: 'blue' },
  'Planning & motivatie': { icon: '◷', color: 'purple' },
  Welzijn: { icon: '♥', color: 'green' },
  Loopbaan: { icon: '➜', color: 'orange' },
}


const OPEN_HELP_REQUESTS = [
  {
    id: 'HV-2041',
    category: 'Studie & vakken',
    title: 'Ik snap de oefeningen van elektrotechniek niet',
    summary:
      'De formules met weerstand en spanning blijven lastig. Ik heb donderdag een toets en weet niet waar ik moet beginnen.',
    question:
      'We krijgen opdrachten over serieschakelingen en parallelschakelingen. Ik snap de theorie wel als de docent het voordoet, maar zodra ik het alleen moet doen weet ik niet welke formule ik moet gebruiken. Kan iemand met mij mee oefenen en uitleggen hoe je dit stap voor stap aanpakt?',
    level: 'Niveau 2 · Elektrotechniek',
    posted: '2 uur geleden',
    wanted: 'Uitleg en samen oefenen',
    isNew: true,
  },
  {
    id: 'HV-2038',
    category: 'Stage',
    title: 'Hoe vraag ik feedback aan mijn stagebegeleider?',
    summary:
      'Mijn stage loopt goed, maar ik durf niet goed te vragen wat ik beter kan. Ik wil graag groeien deze periode.',
    question:
      'Over twee weken heb ik een voortgangsgesprek op mijn stage. Ik wil van tevoren feedback ophalen bij mijn begeleider, maar ik weet niet hoe ik dat gesprek moet beginnen zonder onzeker over te komen. Heeft iemand tips of voorbeeldvragen die ik kan gebruiken?',
    level: 'Niveau 3 · Werktuigbouwkunde',
    posted: '5 uur geleden',
    wanted: 'Tips voor een feedbackgesprek',
    isNew: true,
  },
  {
    id: 'HV-2033',
    category: 'Planning & motivatie',
    title: 'Ik stel alles uit tot de dag voor de deadline',
    summary:
      'Elke keer denk ik dat ik nog genoeg tijd heb, en dan moet alles in één avond. Ik wil dit patroon doorbreken.',
    question:
      'Ik heb moeite om op tijd te beginnen met projecten en huiswerk. Ik weet dat uitstellen niet helpt, maar ik krijg mezelf er niet toe om te starten. Wat werkt voor jullie? Ik zoek vooral een manier om kleine stappen te zetten zonder dat het overweldigend voelt.',
    level: 'Niveau 2 · Bouwkunde',
    posted: '1 dag geleden',
    wanted: 'Samen een planning maken',
    isNew: false,
  },
  {
    id: 'HV-2029',
    category: 'Welzijn',
    title: 'Ik voel me onzeker in groepjes tijdens projecten',
    summary:
      'Tijdens groepswerk zeg ik weinig, ook als ik het antwoord weet. Ik wil graag meer durven zeggen.',
    question:
      'In projectgroepen ben ik meestal stil, omdat ik bang ben dat mijn idee niet goed genoeg is. Daardoor doen anderen vooral het woord. Ik wil hier graag aan werken, maar weet niet hoe. Herkent iemand dit en heb je tips om wat zelfverzekerder te worden in een groep?',
    level: 'Niveau 1 · Procestechniek',
    posted: '1 dag geleden',
    wanted: 'Ervaringen en tips',
    isNew: false,
  },
  {
    id: 'HV-2024',
    category: 'Loopbaan',
    title: 'Twijfel tussen doorstromen naar niveau 4 of gaan werken',
    summary:
      'Ik haal mijn diploma bijna, maar ik weet niet of ik wil doorleren of meteen aan het werk wil.',
    question:
      'Ik zit in mijn laatste jaar en moet binnenkort kiezen: doorstromen naar niveau 4 of een baan zoeken. Beide lijken aantrekkelijk. Hoe hebben jullie deze keuze aangepakt? Ik wil vooral weten waar ik op moet letten en met wie ik hierover kan praten.',
    level: 'Niveau 3 · Mechatronica',
    posted: '2 dagen geleden',
    wanted: 'Meedenken over de keuze',
    isNew: false,
  },
  {
    id: 'HV-2017',
    category: 'Studie & vakken',
    title: 'Wiskunde: hoe oefen ik handiger met breuken?',
    summary:
      'Ik maak veel slordigheidsfouten met breuken. Ik zoek een rustige manier om extra te oefenen.',
    question:
      'Bij wiskunde gaan de opdrachten met breuken vaak mis, vooral als er meerdere stappen nodig zijn. Ik heb het gevoel dat ik de basis mis. Kan iemand mij uitleggen hoe ik dit het beste kan oefenen, en misschien een paar oefeningen met mij doornemen?',
    level: 'Niveau 2 · Laboratoriumtechniek',
    posted: '3 dagen geleden',
    wanted: 'Basisuitleg en oefeningen',
    isNew: false,
  },
]

const LockIcon = ({ size = 14 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="4.5" y="10.5" width="15" height="9.5" rx="2.4" />
    <path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7" />
  </svg>
)

function HelpRequests() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Alle vragen')
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [matchedIds, setMatchedIds] = useState([])
  const [studentRequests] = useState(loadHelpRequests)

  const allRequests = [
    ...studentRequests
      .filter((request) => request.status === 'open')
      .map((request) => ({
        id: `student-${request.id}`,
        category: 'Studie & vakken',
        title: request.titel,
        summary: request.omschrijving,
        question: request.omschrijving,
        level: request.vak,
        posted:
          request.aangemaaktOp && !Number.isNaN(new Date(request.aangemaaktOp).getTime())
            ? `Geplaatst op ${new Date(request.aangemaaktOp).toLocaleDateString('nl-NL')}`
            : 'Recent geplaatst',
        wanted: request.taal ? `Hulp bij ${request.taal}` : 'Uitleg en samen oefenen',
        isNew: true,
      })),
    ...OPEN_HELP_REQUESTS,
  ]

  useEffect(() => {
    if (!selectedRequest) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setSelectedRequest(null)
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [selectedRequest])

  const normalizedQuery = query.trim().toLowerCase()
  const filteredRequests = allRequests.filter((request) => {
    const matchesCategory = category === 'Alle vragen' || request.category === category
    const matchesQuery =
      normalizedQuery === '' ||
      `${request.title} ${request.summary} ${request.category}`.toLowerCase().includes(normalizedQuery)

    return matchesCategory && matchesQuery
  })

  const selectedIsMatched = selectedRequest ? matchedIds.includes(selectedRequest.id) : false

  const closeDialog = () => setSelectedRequest(null)

  const matchRequest = () => {
    if (!selectedRequest) return
    setMatchedIds((current) =>
      current.includes(selectedRequest.id) ? current : [...current, selectedRequest.id],
    )
  }

  return (
    <div className="help-standalone">
      <header className="help-topbar">
        <a className="help-brand" href="/portaal" aria-label="PeerCoach, naar het portaal">
          <img src={logo} alt="" />
          <span>
            <strong>PeerCoach</strong>
            <small>Techniek College Rotterdam</small>
          </span>
        </a>
        <div className="help-topbar__actions">
          <span className="help-topbar__role">
            <LockIcon size={12} />
            Peercoach-weergave
          </span>
          <a className="help-topbar__link" href="/portaal">
            Naar het portaal
          </a>
        </div>
      </header>

      <main className="help-main">
        <section className="help-intro">
          <p className="help-eyebrow">ALS PEERCOACH</p>
          <h1>Open hulpvragen</h1>
          <p>
            Bekijk de vragen van leerlingen en kies onbevooroordeeld welke vraag bij jou past. Je
            ziet alleen de inhoud, nooit wie de vraag stelt.
          </p>
        </section>

      <section className="help-privacy" aria-labelledby="help-privacy-title">
        <span className="help-privacy__icon">
          <LockIcon size={20} />
        </span>
        <div className="help-privacy__content">
          <h2 id="help-privacy-title">Anoniem by design</h2>
          <p>
            Geen naam, e-mailadres of studentnummer van de leerling. Pas na een bevestigde match
            delen jullie gegevens met elkaar.
          </p>
        </div>
        <span className="help-privacy__chip">Privacy beschermd</span>
      </section>

      <section className="help-toolbar" aria-label="Hulpvragen filteren">
        <label className="help-search">
          <span className="help-sr-only">Zoek in hulpvragen</span>
          <svg
            className="help-search__icon"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="6.5" />
            <path d="m16 16 4.5 4.5" />
          </svg>
          <input
            type="search"
            placeholder="Zoek op onderwerp of trefwoord..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>

        <div className="help-filters" role="group" aria-label="Filter op categorie">
          {CATEGORIES.map((option) => (
            <button
              key={option}
              type="button"
              className={`help-filter${category === option ? ' help-filter--active' : ''}`}
              aria-pressed={category === option}
              onClick={() => setCategory(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </section>

      <div className="help-results-heading">
        <p className="help-result-count">
          <strong>{filteredRequests.length}</strong> van {allRequests.length} open vragen
        </p>
        <span className="help-anon-hint">
          <LockIcon size={12} /> Alle vragen zijn anoniem
        </span>
      </div>

      {filteredRequests.length > 0 ? (
        <div className="help-grid">
          {filteredRequests.map((request) => {
            const style = CATEGORY_STYLES[request.category]
            const isMatched = matchedIds.includes(request.id)

            return (
              <article className={`help-card${isMatched ? ' help-card--matched' : ''}`} key={request.id}>
                <div className="help-card__top">
                  <span className={`help-card__icon help-card__icon--${style.color}`} aria-hidden="true">
                    {style.icon}
                  </span>
                  <span className="help-card__category">{request.category}</span>
                  {request.isNew && !isMatched && <span className="help-card__new">Nieuw</span>}
                  <span className="help-card__anon">
                    <LockIcon size={11} />
                    Anoniem
                  </span>
                </div>

                <h2>{request.title}</h2>
                <p className="help-card__summary">{request.summary}</p>

                <div className="help-card__meta">
                  <span>{request.level}</span>
                  <span aria-hidden="true">·</span>
                  <span>{request.posted}</span>
                </div>

                <div className="help-card__footer">
                  <span className="help-card__wanted">{request.wanted}</span>
                  <button type="button" className="help-card__button" onClick={() => setSelectedRequest(request)}>
                    Bekijk vraag <span aria-hidden="true">→</span>
                  </button>
                </div>

                {isMatched && (
                  <p className="help-card__matched-note">
                    <span aria-hidden="true">✓</span> Jij hebt aangegeven deze vraag op te pakken
                  </p>
                )}
              </article>
            )
          })}
        </div>
      ) : (
        <div className="help-empty">
          <span aria-hidden="true">⌕</span>
          <h2>Geen hulpvragen gevonden</h2>
          <p>Probeer een andere zoekterm of kies een andere categorie.</p>
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setCategory('Alle vragen')
            }}
          >
            Alle vragen tonen
          </button>
        </div>
      )}

      {selectedRequest && (
        <div className="help-dialog-backdrop" onClick={closeDialog}>
          <div
            className="help-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="help-dialog-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="help-dialog__close"
              onClick={closeDialog}
              aria-label="Hulpvraag sluiten"
            >
              ×
            </button>

            <div className="help-card__top">
              <span
                className={`help-card__icon help-card__icon--${CATEGORY_STYLES[selectedRequest.category].color}`}
                aria-hidden="true"
              >
                {CATEGORY_STYLES[selectedRequest.category].icon}
              </span>
              <span className="help-card__category">{selectedRequest.category}</span>
              <span className="help-card__anon">
                <LockIcon size={11} />
                Anoniem
              </span>
            </div>

            <h2 id="help-dialog-title">{selectedRequest.title}</h2>
            <p className="help-dialog__meta">
              {selectedRequest.level} <span aria-hidden="true">·</span> {selectedRequest.posted}
            </p>

            <p className="help-dialog__question">{selectedRequest.question}</p>

            <div className="help-dialog__wanted">
              <span>Gevraagde hulp</span>
              <strong>{selectedRequest.wanted}</strong>
            </div>

            {selectedIsMatched ? (
              <>
                <div className="help-dialog__success" role="status">
                  <span className="help-dialog__success-icon" aria-hidden="true">
                    ✓
                  </span>
                  <div>
                    <strong>Top, je pakt deze vraag op!</strong>
                    <p>
                      De leerling krijgt een melding dat een peercoach wil helpen. Jullie namen
                      worden pas zichtbaar nadat de match is bevestigd.
                    </p>
                  </div>
                </div>
                <button type="button" className="help-dialog__primary" onClick={closeDialog}>
                  Sluiten
                </button>
              </>
            ) : (
              <>
                <p className="help-dialog__privacy">
                  <LockIcon size={12} /> De leerling blijft anoniem tot jullie matchen.
                </p>
                <div className="help-dialog__actions">
                  <button type="button" className="help-dialog__secondary" onClick={closeDialog}>
                    Misschien later
                  </button>
                  <button type="button" className="help-dialog__primary" onClick={matchRequest}>
                    Ik wil deze vraag oppakken
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      </main>
    </div>
  )
}

export default HelpRequests
