import { useEffect, useState } from 'react'
import logo from '../assets/logo.png'
import {
  loadHelpRequests,
  loadMatchRequests,
  updateMatchRequest,
} from '../utils/helpRequestStorage.js'
import HelpRequests from './HelpRequests.jsx'
import HelpRequestOverview from './HelpRequestOverview.jsx'
import HelpRequestNew from './HelpRequestNew.jsx'
import HelpRequestEdit from './HelpRequestEdit.jsx'
import './Portal.css'

const navigation = [
  { id: 'overzicht', label: 'Overzicht', icon: '⌂' },
  { id: 'rooster', label: 'Mijn rooster', icon: '▦' },
  { id: 'meldingen', label: 'Notificaties', icon: '♧' },
  { id: 'instellingen', label: 'Instellingen', icon: '⚙' },
  { id: 'account', label: 'Mijn account', icon: '◉' },
]

const helpNavigation = [
  { id: 'mijn-hulpvragen', label: 'Mijn hulpvragen', icon: '✎' },
  { id: 'hulpvraag-nieuw', label: 'Hulpvraag plaatsen', icon: '＋' },
  { id: 'hulpvragen', label: 'Open hulpvragen', icon: '↗' },
]

const schedules = {
  student: [
    { time: '09:00', end: '10:30', title: 'Rekenen', detail: 'Lokaal B2.14 · Les', color: 'orange' },
    { time: '10:45', end: '12:15', title: 'Praktijk: elektrotechniek', detail: 'Werkplaats 1 · Praktijk', color: 'blue' },
    { time: '13:00', end: '14:30', title: 'Nederlands', detail: 'Lokaal A1.08 · Les', color: 'green' },
    { time: '14:45', end: '15:30', title: 'Peercoach-moment', detail: 'Leerplein · Samen leren', color: 'purple' },
  ],
  docent: [
    { time: '08:30', end: '10:00', title: 'Praktijk elektrotechniek', detail: 'Werkplaats 1 · Klas E2A', color: 'orange' },
    { time: '10:15', end: '11:45', title: 'Mentoruur', detail: 'Lokaal B2.14 · Klas E2A', color: 'blue' },
    { time: '12:30', end: '14:00', title: 'Projectbegeleiding', detail: 'Leerplein · Klas E1B', color: 'green' },
    { time: '14:15', end: '15:00', title: 'Teamoverleg', detail: 'Kamer 2.06 · Techniek', color: 'purple' },
  ],
}

const initialNotifications = [
  { id: 1, title: 'Je rooster is bijgewerkt', text: 'Er is een lokaal gewijzigd voor je eerstvolgende praktijkles.', time: 'Vandaag · 08:42', unread: true, icon: '▦' },
  { id: 2, title: 'Welkom bij PeerCoach', text: 'Bekijk je portaal en ontdek wat je vandaag kunt doen.', time: 'Gisteren · 15:10', unread: true, icon: '✳' },
  { id: 3, title: 'Nieuwe week, nieuwe kansen', text: 'Je rooster voor deze week staat voor je klaar.', time: 'Maandag · 09:00', unread: false, icon: '↗' },
]

const settingOptions = [
  { id: 'rooster', title: 'Roosterwijzigingen', description: 'Ontvang een melding als je rooster verandert.', enabled: true },
  { id: 'school', title: 'Schoolmededelingen', description: 'Blijf op de hoogte van nieuws van school.', enabled: true },
  { id: 'coach', title: 'PeerCoach-updates', description: 'Ontvang tips en updates over samen leren.', enabled: false },
]

function getStoredUser() {
  const email = localStorage.getItem('email') || sessionStorage.getItem('email') || ''
  if (/^[^\s@]+@student\.zadkine\.nl$/i.test(email)) {
    return { email, role: 'student' }
  }
  if (/^[^\s@]+@tcrmbo\.nl$/i.test(email)) {
    return { email, role: 'docent' }
  }

  return null
}

function Portal() {
  const [user] = useState(getStoredUser)
  const [activePage, setActivePage] = useState('overzicht')
  const [notifications, setNotifications] = useState(initialNotifications)
  const [settings, setSettings] = useState(settingOptions)
  const [matchRequests, setMatchRequests] = useState(loadMatchRequests)
  const [helpRequests] = useState(loadHelpRequests)
  const [matchFilter, setMatchFilter] = useState('all')
  const [selectedMatchRequestId, setSelectedMatchRequestId] = useState(null)
  const [matchActionError, setMatchActionError] = useState('')
  const [matchActionNotice, setMatchActionNotice] = useState('')
  const [requestNotice, setRequestNotice] = useState('')
  const [editingHelpRequestId, setEditingHelpRequestId] = useState(null)

  useEffect(() => {
    if (!user) {
      window.location.replace('/login')
    }
  }, [user])

  useEffect(() => {
    if (!selectedMatchRequestId) return undefined

    function handleKeyDown(event) {
      if (event.key === 'Escape') setSelectedMatchRequestId(null)
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [selectedMatchRequestId])

  if (!user) return null

  const isStudent = user.role === 'student'
  const firstName = isStudent ? `Student ${user.email.split('@')[0]}` : user.email.split('@')[0]
  const roleLabel = isStudent ? 'Student' : 'Docent'
  const portalNavigation = isStudent
    ? navigation
    : [...navigation, { id: 'matchverzoeken', label: 'Matchverzoeken', icon: '⇄' }]
  const currentPageLabel = portalNavigation.find((item) => item.id === activePage)?.label
    ?? helpNavigation.find((item) => item.id === activePage)?.label
    ?? (activePage === 'hulpvraag-bewerken' ? 'Hulpvraag bewerken' : undefined)
  const selectedMatchRequest = matchRequests.find(
    (matchRequest) => String(matchRequest.id) === String(selectedMatchRequestId),
  )
  const pendingMatchCount = matchRequests.filter(
    (matchRequest) => (matchRequest.status ?? 'pending') === 'pending',
  ).length
  const unreadCount = notifications.filter((notification) => notification.unread).length
  const today = new Intl.DateTimeFormat('nl-NL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date())
  const dayName = new Intl.DateTimeFormat('nl-NL', { weekday: 'long' }).format(new Date())
  const schedule = schedules[user.role]

  const logout = () => {
    localStorage.removeItem('email')
    localStorage.removeItem('rememberMe')
    sessionStorage.removeItem('email')
    window.location.assign('/login')
  }

  const markAllRead = () => {
    setNotifications((current) => current.map((notification) => ({ ...notification, unread: false })))
  }

  const toggleSetting = (settingId) => {
    setSettings((current) => current.map((setting) => (
      setting.id === settingId ? { ...setting, enabled: !setting.enabled } : setting
    )))
  }

  const renderSchedule = (compact = false) => (
    <div className={`portal-schedule${compact ? ' portal-schedule--compact' : ''}`}>
      {schedule.map((item) => (
        <article className="portal-schedule__item" key={item.time}>
          <time className="portal-schedule__time">{item.time}<span>{item.end}</span></time>
          <span className={`portal-schedule__marker portal-schedule__marker--${item.color}`} aria-hidden="true" />
          <div className="portal-schedule__details">
            <h3>{item.title}</h3>
            <p>{item.detail}</p>
          </div>
          {!compact && <span className="portal-schedule__arrow" aria-hidden="true">→</span>}
        </article>
      ))}
    </div>
  )

  const renderNotifications = (compact = false) => {
    const visibleNotifications = compact ? notifications.slice(0, 2) : notifications

    return (
      <div className="portal-notifications">
        {visibleNotifications.map((notification) => (
          <article className={`portal-notification${notification.unread ? ' portal-notification--unread' : ''}`} key={notification.id}>
            <span className="portal-notification__icon" aria-hidden="true">{notification.icon}</span>
            <div className="portal-notification__body">
              <div className="portal-notification__heading">
                <h3>{notification.title}</h3>
                {notification.unread && <span className="portal-notification__dot" aria-label="Ongelezen" />}
              </div>
              <p>{notification.text}</p>
              <time>{notification.time}</time>
            </div>
          </article>
        ))}
        {visibleNotifications.length === 0 && (
          <p className="portal-empty">Je hebt nog geen notificaties.</p>
        )}
      </div>
    )
  }

  const renderOverview = () => (
    <>
      <section className="portal-welcome">
        <div>
          <p className="portal-eyebrow">{today}</p>
          <h1>Goedemorgen, {firstName} <span aria-hidden="true">✦</span></h1>
          <p>Welkom in jouw PeerCoach-portaal. Dit is wat er vandaag voor je klaarstaat.</p>
        </div>
        <div className="portal-welcome__badge" aria-hidden="true">✳</div>
      </section>

      <section className="portal-stats" aria-label="Jouw dag in cijfers">
        <article className="portal-stat">
          <span className="portal-stat__icon portal-stat__icon--orange" aria-hidden="true">▦</span>
          <div><p>Op je rooster</p><strong>{schedule.length} <small>activiteiten</small></strong></div>
          <span className="portal-stat__hint">vandaag</span>
        </article>
        <article className="portal-stat">
          <span className="portal-stat__icon portal-stat__icon--blue" aria-hidden="true">◷</span>
          <div><p>Eerstvolgende start</p><strong>{schedule[0].time} <small>uur</small></strong></div>
          <span className="portal-stat__hint">op tijd erbij</span>
        </article>
        <article className="portal-stat">
          <span className="portal-stat__icon portal-stat__icon--purple" aria-hidden="true">♧</span>
          <div><p>Nieuwe meldingen</p><strong>{unreadCount} <small>ongelezen</small></strong></div>
          <button className="portal-text-button" type="button" onClick={() => setActivePage('meldingen')}>Bekijk</button>
        </article>
      </section>

      <div className="portal-dashboard-grid">
        <section className="portal-card portal-card--schedule">
          <div className="portal-card__heading">
            <div><p className="portal-card__eyebrow">JOUW DAG</p><h2>Vandaag op het rooster</h2></div>
            <button className="portal-text-button" type="button" onClick={() => setActivePage('rooster')}>Hele rooster <span aria-hidden="true">→</span></button>
          </div>
          <div className="portal-day-label"><span className="portal-day-label__dot" />{dayName} <span>·</span> {today}</div>
          {renderSchedule(true)}
        </section>

        <section className="portal-card portal-card--notifications">
          <div className="portal-card__heading">
            <div><p className="portal-card__eyebrow">BLIJF OP DE HOOGTE</p><h2>Notificaties</h2></div>
            <button className="portal-icon-button" type="button" aria-label="Alle notificaties bekijken" onClick={() => setActivePage('meldingen')}>→</button>
          </div>
          {renderNotifications(true)}
          <button className="portal-card__footer-link" type="button" onClick={() => setActivePage('meldingen')}>Alle notificaties bekijken <span aria-hidden="true">→</span></button>
        </section>
      </div>

      <section className="portal-tip">
        <span className="portal-tip__icon" aria-hidden="true">✳</span>
        <div><strong>Samen kom je verder</strong><p>{isStudent ? 'Een vraag over de les? Vraag een klasgenoot om samen te oefenen op het leerplein.' : 'Begeleid je klas, geef feedback en houd de voortgang van projecten scherp.'}</p></div>
        <span className="portal-tip__spark" aria-hidden="true">✦</span>
      </section>
    </>
  )

  const renderSchedulePage = () => (
    <>
      <section className="portal-page-intro">
        <p className="portal-eyebrow">JOUW PLANNING</p>
        <h1>{isStudent ? 'Mijn rooster' : 'Mijn les- en mentorplanning'}</h1>
        <p>{isStudent ? 'Een handig overzicht van je activiteiten voor vandaag.' : 'Een overzicht van je lessen, mentoruren en begeleidingsmomenten voor vandaag.'}</p>
      </section>
      <section className="portal-card portal-full-card">
        <div className="portal-card__heading">
          <div><p className="portal-card__eyebrow">{today.toUpperCase()}</p><h2>{dayName} · Techniek College Rotterdam</h2></div>
          <span className="portal-date-chip">Vandaag</span>
        </div>
        {renderSchedule()}
        <p className="portal-demo-note">Dit is een voorbeeldrooster. Voor actuele lestijden en lokalen, raadpleeg de officiële schoolomgeving.</p>
      </section>
      <section className="portal-week-card">
        <span aria-hidden="true">✦</span><div><strong>Goed voorbereid op pad</strong><p>Controleer voor vertrek altijd de officiële schoolomgeving op roosterwijzigingen.</p></div>
      </section>
    </>
  )

  const renderNotificationsPage = () => (
    <>
      <section className="portal-page-intro portal-page-intro--actions">
        <div><p className="portal-eyebrow">DIT WIL JE WETEN</p><h1>Notificaties</h1><p>{isStudent ? 'Alle updates over jouw rooster en PeerCoach op één plek.' : 'Alle updates over je lessen, mentoruren en studentvolging op één plek.'}</p></div>
        <button className="portal-secondary-button" type="button" onClick={markAllRead} disabled={unreadCount === 0}>Markeer alles als gelezen</button>
      </section>
      <section className="portal-card portal-full-card">
        <div className="portal-card__heading"><div><p className="portal-card__eyebrow">INBOX</p><h2>Jouw meldingen <span className="portal-count">{unreadCount} nieuw</span></h2></div></div>
        {renderNotifications()}
      </section>
    </>
  )

  const renderSettingsPage = () => (
    <>
      <section className="portal-page-intro"><p className="portal-eyebrow">MAAK HET JOUW PLEK</p><h1>Instellingen</h1><p>{isStudent ? 'Kies welke updates je wilt ontvangen.' : 'Kies welke updates je als docent wilt ontvangen over lessen en begeleiding.'}</p></section>
      <section className="portal-card portal-full-card portal-settings-card">
        <div className="portal-card__heading"><div><p className="portal-card__eyebrow">VOORKEUREN</p><h2>Notificaties</h2></div></div>
        {settings.map((setting) => (
          <div className="portal-setting" key={setting.id}>
            <div><h3>{setting.title}</h3><p>{setting.description}</p></div>
            <button
              className={`portal-switch${setting.enabled ? ' portal-switch--on' : ''}`}
              type="button"
              role="switch"
              aria-checked={setting.enabled}
              aria-label={setting.title}
              onClick={() => toggleSetting(setting.id)}
            ><span /></button>
          </div>
        ))}
      </section>
      <section className="portal-card portal-full-card portal-settings-card">
        <div className="portal-card__heading"><div><p className="portal-card__eyebrow">WEERGAVE</p><h2>Standaard instellingen</h2></div></div>
        <div className="portal-preference-row"><span><strong>Taal</strong><small>De taal van het portaal</small></span><span className="portal-preference-value">Nederlands <span aria-hidden="true">⌄</span></span></div>
        <div className="portal-preference-row"><span><strong>Startpagina</strong><small>Wat je ziet als je inlogt</small></span><span className="portal-preference-value">Overzicht <span aria-hidden="true">⌄</span></span></div>
      </section>
    </>
  )

  const renderAccountPage = () => (
    <>
      <section className="portal-page-intro"><p className="portal-eyebrow">JOUW GEGEVENS</p><h1>Mijn account</h1><p>Bekijk de gegevens van je PeerCoach-account.</p></section>
      <section className="portal-card portal-full-card portal-profile-card">
        <div className="portal-profile-card__top">
          <div className="portal-avatar">{isStudent ? 'S' : firstName.charAt(0).toUpperCase()}</div>
          <div><p className="portal-card__eyebrow">PEERCOACH-ACCOUNT</p><h2>{firstName}</h2><span className="portal-role-chip">{roleLabel}</span></div>
        </div>
        <div className="portal-profile-details">
          <div><span>E-mailadres</span><strong>{user.email}</strong></div>
          <div><span>Rol</span><strong>{roleLabel}</strong></div>
          <div><span>School</span><strong>Techniek College Rotterdam</strong></div>
          {isStudent ? (
            <div><span>Studentnummer</span><strong>{user.email.split('@')[0]}</strong></div>
          ) : (
            <div><span>Werkzaam als</span><strong>Docent / begeleider</strong></div>
          )}
        </div>
        <p className="portal-demo-note">Accountgegevens zijn in deze demo alleen lokaal opgeslagen. Voor wijzigingen kun je terecht bij de schooladministratie.</p>
      </section>
    </>
  )

  const renderMyHelpRequestsPage = () => (
    <HelpRequestOverview
      embedded
      noticeOverride={requestNotice}
      onCreateRequest={() => setActivePage('hulpvraag-nieuw')}
      onEditRequest={(id) => {
        setEditingHelpRequestId(id)
        setActivePage('hulpvraag-bewerken')
      }}
    />
  )

  const renderNewHelpRequestPage = () => (
    <HelpRequestNew
      embedded
      onCancel={() => setActivePage('mijn-hulpvragen')}
      onComplete={() => {
        setRequestNotice('geplaatst')
        setActivePage('mijn-hulpvragen')
      }}
    />
  )

  const renderEditHelpRequestPage = () => (
    <HelpRequestEdit
      id={editingHelpRequestId}
      embedded
      onCancel={() => setActivePage('mijn-hulpvragen')}
      onComplete={() => {
        setRequestNotice('bijgewerkt')
        setActivePage('mijn-hulpvragen')
      }}
    />
  )

  const renderMatchRequestsPage = () => {
    const filteredMatchRequests = matchRequests
      .filter((matchRequest) => (
        matchFilter === 'all' || (matchRequest.status ?? 'pending') === matchFilter
      ))
      .sort((first, second) => new Date(second.aangemaaktOp) - new Date(first.aangemaaktOp))

    const statusLabels = {
      pending: 'In afwachting',
      approved: 'Goedgekeurd',
      rejected: 'Afgewezen',
    }

    function decideMatchRequest(matchRequest, status) {
      const updatedMatchRequest = updateMatchRequest(matchRequest.id, status)
      if (!updatedMatchRequest) {
        setMatchActionError(
          status === 'approved'
            ? 'Goedkeuren kan pas als leerling en peercoach hun contactgegevens hebben ingevuld.'
            : 'De status is niet opgeslagen. Vernieuw de pagina en probeer het opnieuw.',
        )
        return
      }

      setMatchRequests((current) => current.map((item) => (
        String(item.id) === String(matchRequest.id)
          ? updatedMatchRequest
          : item
      )))
      setMatchActionError('')
      setMatchActionNotice(`Matchverzoek ${status === 'approved' ? 'goedgekeurd' : 'afgewezen'}.`)
    }

    function formatSubmittedDate(value) {
      const date = new Date(value)
      if (Number.isNaN(date.getTime())) return 'Datum onbekend'

      return new Intl.DateTimeFormat('nl-NL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date)
    }

    function getRelatedHelpRequest(matchRequest) {
      return helpRequests.find(
        (request) => String(request.id) === String(matchRequest.helpRequestId),
      )
    }

    const renderMatchActions = (matchRequest) => {
      const helpRequest = getRelatedHelpRequest(matchRequest)
      const canApprove = Boolean(
        helpRequest?.contactgegevens?.naam &&
        helpRequest.contactgegevens.email &&
        matchRequest.coachContact?.naam &&
        matchRequest.coachContact.email,
      )

      return (
        <>
          <div className="portal-match-actions">
            <button
              className="portal-secondary-button portal-match-actions__reject"
              type="button"
              onClick={() => decideMatchRequest(matchRequest, 'rejected')}
            >
              Afwijzen
            </button>
            <button
              className="portal-match-actions__approve"
              type="button"
              onClick={() => decideMatchRequest(matchRequest, 'approved')}
              disabled={!canApprove}
              title={!canApprove ? 'Contactgegevens van leerling en peercoach zijn nodig.' : undefined}
            >
              Goedkeuren
            </button>
          </div>
          {!canApprove && (
            <p className="portal-match-action-hint">
              Goedkeuren kan zodra de leerling- en peercoachcontactgegevens beschikbaar zijn.
            </p>
          )}
        </>
      )
    }

    return (
      <>
        <section className="portal-page-intro">
          <p className="portal-eyebrow">PEERCOACH-BEGELEIDING</p>
          <h1>Matchverzoeken beheren</h1>
          <p>Bekijk de anonieme hulpvraag en motivatie van iedere peercoach en beslis over het verzoek.</p>
        </section>

        {matchActionError && <p className="portal-match-error" role="alert">{matchActionError}</p>}
        {matchActionNotice && <p className="portal-match-success" role="status">{matchActionNotice}</p>}

        <section className="portal-card portal-full-card portal-match-list" aria-label="Matchverzoeken">
          <div className="portal-match-toolbar">
            <div>
              <p className="portal-card__eyebrow">INBOX</p>
              <h2>Ingediende verzoeken <span className="portal-count">{pendingMatchCount} in afwachting</span></h2>
            </div>
            <label className="portal-match-filter">
              <span>Toon status</span>
              <select value={matchFilter} onChange={(event) => setMatchFilter(event.target.value)}>
                <option value="all">Alle verzoeken</option>
                <option value="pending">In afwachting</option>
                <option value="approved">Goedgekeurd</option>
                <option value="rejected">Afgewezen</option>
              </select>
            </label>
          </div>

          {filteredMatchRequests.length === 0 ? (
            <p className="portal-empty">
              {matchRequests.length === 0
                ? 'Er zijn nog geen matchverzoeken ingediend.'
                : 'Er zijn geen verzoeken met deze status.'}
            </p>
          ) : (
            <div className="portal-match-cards">
              {filteredMatchRequests.map((matchRequest) => {
                const request = getRelatedHelpRequest(matchRequest)
                const status = matchRequest.status ?? 'pending'

                return (
                  <article className="portal-match-card" key={matchRequest.id}>
                    <div className="portal-match-card__top">
                      <span className={`portal-match-status portal-match-status--${status}`}>
                        {statusLabels[status] ?? statusLabels.pending}
                      </span>
                      <time dateTime={matchRequest.aangemaaktOp}>
                        Ingediend op {formatSubmittedDate(matchRequest.aangemaaktOp)}
                      </time>
                    </div>
                    <h3>{request?.titel ?? matchRequest.helpRequestTitle ?? 'Anonieme hulpvraag'}</h3>
                    <p className="portal-match-card__label">Anonieme hulpvraag</p>
                    <p className="portal-match-card__question">
                      {request?.omschrijving ?? 'De oorspronkelijke hulpvraag is niet meer beschikbaar.'}
                    </p>
                    <p className="portal-match-card__label">Motivatie peercoach</p>
                    <p className="portal-match-card__motivation">{matchRequest.motivation}</p>
                    <div className="portal-match-card__footer">
                      <button
                        className="portal-text-button"
                        type="button"
                        onClick={() => setSelectedMatchRequestId(matchRequest.id)}
                      >
                        Bekijk verzoek <span aria-hidden="true">→</span>
                      </button>
                      {status === 'pending' && renderMatchActions(matchRequest)}
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>

        {selectedMatchRequest && (
          <div
            className="portal-match-backdrop"
            onClick={() => setSelectedMatchRequestId(null)}
          >
            <section
              className="portal-match-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="portal-match-dialog-title"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                className="portal-match-dialog__close"
                type="button"
                aria-label="Verzoek sluiten"
                onClick={() => setSelectedMatchRequestId(null)}
              >
                ×
              </button>
              <p className="portal-card__eyebrow">ANONIEM MATCHVERZOEK</p>
              <h2 id="portal-match-dialog-title">
                {getRelatedHelpRequest(selectedMatchRequest)?.titel
                  ?? selectedMatchRequest.helpRequestTitle
                  ?? 'Anonieme hulpvraag'}
              </h2>
              <p className="portal-match-dialog__privacy">
                Leerlingcontactgegevens blijven verborgen zolang dit verzoek niet is goedgekeurd.
              </p>
              <div className="portal-match-dialog__section">
                <h3>Hulpvraag</h3>
                <p>
                  {getRelatedHelpRequest(selectedMatchRequest)?.omschrijving
                    ?? 'De oorspronkelijke hulpvraag is niet meer beschikbaar.'}
                </p>
              </div>
              <div className="portal-match-dialog__section">
                <h3>Motivatie peercoach</h3>
                <p>{selectedMatchRequest.motivation}</p>
              </div>
              <p className="portal-match-dialog__date">
                Ingediend op {formatSubmittedDate(selectedMatchRequest.aangemaaktOp)}
              </p>
              <div className="portal-match-dialog__footer">
                <span className={`portal-match-status portal-match-status--${selectedMatchRequest.status ?? 'pending'}`}>
                  {statusLabels[selectedMatchRequest.status ?? 'pending'] ?? statusLabels.pending}
                </span>
                {(selectedMatchRequest.status ?? 'pending') === 'pending'
                  && renderMatchActions(selectedMatchRequest)}
              </div>
            </section>
          </div>
        )}
      </>
    )
  }

  const pageContent = {
    overzicht: renderOverview,
    rooster: renderSchedulePage,
    meldingen: renderNotificationsPage,
    instellingen: renderSettingsPage,
    account: renderAccountPage,
    matchverzoeken: renderMatchRequestsPage,
    'mijn-hulpvragen': renderMyHelpRequestsPage,
    'hulpvraag-nieuw': renderNewHelpRequestPage,
    'hulpvraag-bewerken': renderEditHelpRequestPage,
    hulpvragen: () => <HelpRequests embedded />,
  }[activePage]()

  return (
    <div className="portal-shell">
      <aside className="portal-sidebar">
        <a className="portal-brand" href="/portaal" onClick={(event) => { event.preventDefault(); setActivePage('overzicht') }}>
          <img src={logo} alt="" /><span><strong>PeerCoach</strong><small>JOUW LEEROMGEVING</small></span>
        </a>
        <p className="portal-nav-label">MENU</p>
        <nav className="portal-nav" aria-label="Portaal navigatie">
          {portalNavigation.map((item) => (
            <button className={`portal-nav__item${activePage === item.id ? ' portal-nav__item--active' : ''}`} type="button" key={item.id} onClick={() => setActivePage(item.id)}>
              <span className="portal-nav__icon" aria-hidden="true">{item.icon}</span><span>{item.label}</span>
              {item.id === 'meldingen' && unreadCount > 0 && <span className="portal-nav__count">{unreadCount}</span>}
              {item.id === 'matchverzoeken' && pendingMatchCount > 0 && <span className="portal-nav__count">{pendingMatchCount}</span>}
            </button>
          ))}
          {helpNavigation.map((item) => (
            <button
              className={`portal-nav__item${activePage === item.id ? ' portal-nav__item--active' : ''}`}
              type="button"
              key={item.id}
              aria-current={activePage === item.id ? 'page' : undefined}
              onClick={() => setActivePage(item.id)}
            >
              <span className="portal-nav__icon" aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="portal-sidebar__bottom">
          <div className="portal-help-card"><span aria-hidden="true">✦</span><strong>Kom je ergens niet uit?</strong><p>Vraag hulp aan je docent of mentor.</p></div>
          <button className="portal-logout" type="button" onClick={logout}><span aria-hidden="true">↪</span> Uitloggen</button>
          <span className="portal-sidebar__version">PeerCoach · Demoportaal</span>
        </div>
      </aside>

      <main className="portal-main">
        <header className="portal-topbar">
          <div className="portal-breadcrumb"><span>PeerCoach</span><span aria-hidden="true">/</span><strong>{currentPageLabel}</strong></div>
          <div className="portal-topbar__user">
            <button className="portal-topbar__notification" type="button" aria-label={`${unreadCount} ongelezen notificaties`} onClick={() => setActivePage('meldingen')}>
              ♧{unreadCount > 0 && <span />}
            </button>
            <button className="portal-user-chip" type="button" onClick={() => setActivePage('account')}>
              <span className="portal-avatar portal-avatar--small">{isStudent ? 'S' : firstName.charAt(0).toUpperCase()}</span>
              <span><strong>{firstName}</strong><small>{isStudent ? 'Student' : 'Docent'}</small></span>
              <span className="portal-user-chip__chevron" aria-hidden="true">⌄</span>
            </button>
          </div>
        </header>
        <div className="portal-content">{pageContent}</div>
        <footer className="portal-footer"><span>© {new Date().getFullYear()} PeerCoach · Techniek College Rotterdam</span><span>Samen kom je verder <b aria-hidden="true">✦</b></span></footer>
      </main>
    </div>
  )
}

export default Portal
