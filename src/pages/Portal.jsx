import { useEffect, useState } from 'react'
import logo from '../assets/logo.png'
import './Portal.css'

const navigation = [
  { id: 'overzicht', label: 'Overzicht', icon: '⌂' },
  { id: 'rooster', label: 'Mijn rooster', icon: '▦' },
  { id: 'meldingen', label: 'Notificaties', icon: '♧' },
  { id: 'instellingen', label: 'Instellingen', icon: '⚙' },
  { id: 'account', label: 'Mijn account', icon: '◉' },
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
  const email = localStorage.getItem('email') || ''
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

  useEffect(() => {
    if (!user) {
      window.location.replace('/login')
    }
  }, [user])

  if (!user) return null

  const isStudent = user.role === 'student'
  const firstName = isStudent ? `Student ${user.email.split('@')[0]}` : user.email.split('@')[0]
  const roleLabel = isStudent ? 'Student' : 'Docent'
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

  const pageContent = {
    overzicht: renderOverview,
    rooster: renderSchedulePage,
    meldingen: renderNotificationsPage,
    instellingen: renderSettingsPage,
    account: renderAccountPage,
  }[activePage]()

  return (
    <div className="portal-shell">
      <aside className="portal-sidebar">
        <a className="portal-brand" href="/portaal" onClick={(event) => { event.preventDefault(); setActivePage('overzicht') }}>
          <img src={logo} alt="" /><span><strong>PeerCoach</strong><small>JOUW LEEROMGEVING</small></span>
        </a>
        <p className="portal-nav-label">MENU</p>
        <nav className="portal-nav" aria-label="Portaal navigatie">
          {navigation.map((item) => (
            <button className={`portal-nav__item${activePage === item.id ? ' portal-nav__item--active' : ''}`} type="button" key={item.id} onClick={() => setActivePage(item.id)}>
              <span className="portal-nav__icon" aria-hidden="true">{item.icon}</span><span>{item.label}</span>
              {item.id === 'meldingen' && unreadCount > 0 && <span className="portal-nav__count">{unreadCount}</span>}
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
          <div className="portal-breadcrumb"><span>PeerCoach</span><span aria-hidden="true">/</span><strong>{navigation.find((item) => item.id === activePage)?.label}</strong></div>
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
