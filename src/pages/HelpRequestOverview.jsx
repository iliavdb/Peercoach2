import { useEffect, useState } from 'react'
import { deleteHelpRequest, loadHelpRequests } from '../utils/helpRequestStorage.js'

const STATUS_META = {
  open: { label: 'Open', className: 'request-badge--open' },
  in_behandeling: { label: 'In behandeling', className: 'request-badge--progress' },
  afgerond: { label: 'Afgerond', className: 'request-badge--done' },
}

const NOTICES = {
  geplaatst: 'Je hulpvraag is geplaatst en staat open voor peercoaches.',
  bijgewerkt: 'Je hulpvraag is bijgewerkt.',
  verwijderd: 'Je hulpvraag is verwijderd.',
}

function formatDate(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Datum onbekend'

  return new Intl.DateTimeFormat('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export default function HelpRequestOverview() {
  const [requests, setRequests] = useState(loadHelpRequests)
  const [requestToDelete, setRequestToDelete] = useState(null)
  const [notice, setNotice] = useState(
    () => new URLSearchParams(window.location.search).get('melding'),
  )
  const [deleteError, setDeleteError] = useState('')
  const sortedRequests = [...requests].sort(
    (first, second) => new Date(second.aangemaaktOp) - new Date(first.aangemaaktOp),
  )

  useEffect(() => {
    if (!requestToDelete) return undefined

    function handleKeyDown(event) {
      if (event.key === 'Escape') setRequestToDelete(null)
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [requestToDelete])

  function confirmDelete() {
    if (!requestToDelete) return

    if (!deleteHelpRequest(requestToDelete.id)) {
      setDeleteError('Verwijderen is niet gelukt. Vernieuw de pagina en probeer het opnieuw.')
      setRequestToDelete(null)
      return
    }

    setRequests((current) =>
      current.filter((request) => String(request.id) !== String(requestToDelete.id)),
    )
    setNotice('verwijderd')
    setDeleteError('')
    setRequestToDelete(null)
  }

  return (
    <section className="request-page" aria-labelledby="my-requests-title">
      <div className="request-page__heading request-page__heading--actions">
        <div>
          <p className="request-eyebrow">OVERZICHT</p>
          <h1 id="my-requests-title">Mijn hulpvragen</h1>
          <p>Volg de status van je vragen. Open vragen zijn zichtbaar voor peercoaches.</p>
        </div>
        <a className="request-button request-button--primary" href="/hulpvraag/nieuw">+ Nieuwe hulpvraag</a>
      </div>

      {notice && NOTICES[notice] && <p className="request-notice" role="status">{NOTICES[notice]}</p>}
      {deleteError && <p className="request-alert" role="alert">{deleteError}</p>}

      {sortedRequests.length === 0 ? (
        <div className="request-panel request-empty">
          <span aria-hidden="true">✦</span>
          <h2>Je hebt nog geen hulpvragen</h2>
          <p>Plaats je eerste vraag en een peercoach kan met je meedenken.</p>
          <a className="request-button request-button--primary" href="/hulpvraag/nieuw">Nu een hulpvraag plaatsen</a>
        </div>
      ) : (
        <div className="request-list">
          {sortedRequests.map((request) => {
            const status = STATUS_META[request.status] ?? STATUS_META.open
            const canEdit = request.status !== 'afgerond'

            return (
              <article className="request-card" key={request.id}>
                <div className="request-card__top">
                  <div className="request-card__tags">
                    <span className="request-badge request-badge--subject">{request.vak || 'Ander vak'}</span>
                    {request.taal && <span className="request-badge request-badge--subject">{request.taal}</span>}
                  </div>
                  <span className={`request-badge ${status.className}`}>{status.label}</span>
                </div>
                <h2>{request.titel}</h2>
                <p className="request-card__description">{request.omschrijving}</p>
                <p className="request-card__date">Geplaatst op {formatDate(request.aangemaaktOp)}</p>
                {canEdit ? (
                  <div className="request-card__actions">
                    <a className="request-button request-button--secondary" href={`/hulpvraag/${encodeURIComponent(request.id)}/bewerk`}>Bewerken</a>
                    <button className="request-button request-button--danger" type="button" onClick={() => setRequestToDelete(request)}>Verwijderen</button>
                  </div>
                ) : (
                  <p className="request-card__locked">Afgerond — niet meer aan te passen.</p>
                )}
              </article>
            )
          })}
        </div>
      )}

      {requestToDelete && (
        <div className="request-modal-backdrop" onClick={() => setRequestToDelete(null)}>
          <div
            className="request-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-request-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="delete-request-title">Hulpvraag verwijderen</h2>
            <p>Weet je zeker dat je &ldquo;{requestToDelete.titel}&rdquo; wilt verwijderen? Dit kan niet ongedaan worden gemaakt.</p>
            <div className="request-form__actions">
              <button className="request-button request-button--secondary" type="button" onClick={() => setRequestToDelete(null)}>Annuleren</button>
              <button className="request-button request-button--danger" type="button" onClick={confirmDelete}>Ja, verwijderen</button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
