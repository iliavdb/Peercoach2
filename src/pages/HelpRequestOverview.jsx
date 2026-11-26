import { useEffect, useState } from 'react'
import {
  deleteHelpRequest,
  loadHelpRequests,
  loadMatchRequests,
} from '../utils/helpRequestStorage.js'

const STATUS_META = {
  open: { label: 'Open', className: 'request-badge--open' },
  in_behandeling: { label: 'In behandeling', className: 'request-badge--progress' },
  afgerond: { label: 'Afgerond', className: 'request-badge--done' },
}

const MATCH_STATUS_META = {
  pending: { label: 'In afwachting van docent', className: 'request-match__status--pending' },
  approved: { label: 'Match goedgekeurd', className: 'request-match__status--approved' },
  rejected: { label: 'Verzoek afgewezen', className: 'request-match__status--rejected' },
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

function formatMatchDate(value) {
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

export default function HelpRequestOverview({
  embedded = false,
  onCreateRequest,
  onEditRequest,
  noticeOverride,
}) {
  const [requests, setRequests] = useState(loadHelpRequests)
  const [matchRequests] = useState(loadMatchRequests)
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
    <section className={`request-page${embedded ? ' request-page--embedded' : ''}`} aria-labelledby="my-requests-title">
      <div className="request-page__heading request-page__heading--actions">
        <div>
          <p className="request-eyebrow">OVERZICHT</p>
          <h1 id="my-requests-title">Mijn hulpvragen</h1>
          <p>Volg de status van je vragen. Open vragen zijn zichtbaar voor peercoaches.</p>
        </div>
        {onCreateRequest ? (
          <button className="request-button request-button--primary" type="button" onClick={onCreateRequest}>+ Nieuwe hulpvraag</button>
        ) : (
          <a className="request-button request-button--primary" href="/hulpvraag/nieuw">+ Nieuwe hulpvraag</a>
        )}
      </div>

      {(noticeOverride || notice) && NOTICES[noticeOverride || notice] && (
        <p className="request-notice" role="status">{NOTICES[noticeOverride || notice]}</p>
      )}
      {deleteError && <p className="request-alert" role="alert">{deleteError}</p>}

      {sortedRequests.length === 0 ? (
        <div className="request-panel request-empty">
          <span aria-hidden="true">✦</span>
          <h2>Je hebt nog geen hulpvragen</h2>
          <p>Plaats je eerste vraag en een peercoach kan met je meedenken.</p>
          {onCreateRequest ? (
            <button className="request-button request-button--primary" type="button" onClick={onCreateRequest}>Nu een hulpvraag plaatsen</button>
          ) : (
            <a className="request-button request-button--primary" href="/hulpvraag/nieuw">Nu een hulpvraag plaatsen</a>
          )}
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
                {matchRequests.filter((matchRequest) => matchRequest.helpRequestId === request.id).length > 0 && (
                  <section className="request-match-list" aria-label="Ontvangen matchverzoeken">
                    <h3>Matchverzoeken</h3>
                    {matchRequests
                      .filter((matchRequest) => matchRequest.helpRequestId === request.id)
                      .map((matchRequest) => (
                        <article className="request-match" key={matchRequest.id}>
                          <p className={`request-match__status ${MATCH_STATUS_META[matchRequest.status ?? 'pending']?.className ?? MATCH_STATUS_META.pending.className}`}>
                            {MATCH_STATUS_META[matchRequest.status ?? 'pending']?.label ?? MATCH_STATUS_META.pending.label}
                          </p>
                          <p>{matchRequest.motivation}</p>
                          <time dateTime={matchRequest.aangemaaktOp}>
                            Ontvangen op {formatMatchDate(matchRequest.aangemaaktOp)}
                          </time>
                          {(matchRequest.status ?? 'pending') === 'approved' && matchRequest.coachContact && (
                            <div className="request-match__contact">
                              <strong>Peercoach-contact</strong>
                              <span>{matchRequest.coachContact.naam}</span>
                              <a href={`mailto:${matchRequest.coachContact.email}`}>{matchRequest.coachContact.email}</a>
                              {matchRequest.coachContact.beschikbaarheid && (
                                <span>Voorstel: {matchRequest.coachContact.beschikbaarheid}</span>
                              )}
                            </div>
                          )}
                          {matchRequest.status === 'rejected' && (
                            <p className="request-match__closed">Er is geen match ontstaan.</p>
                          )}
                        </article>
                      ))}
                  </section>
                )}
                {canEdit ? (
                  <div className="request-card__actions">
                    {onEditRequest ? (
                      <button className="request-button request-button--secondary" type="button" onClick={() => onEditRequest(request.id)}>Bewerken</button>
                    ) : (
                      <a className="request-button request-button--secondary" href={`/hulpvraag/${encodeURIComponent(request.id)}/bewerk`}>Bewerken</a>
                    )}
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
