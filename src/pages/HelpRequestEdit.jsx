import HelpRequestForm from '../components/HelpRequestForm.jsx'
import { getHelpRequest, updateHelpRequest } from '../utils/helpRequestStorage.js'

export default function HelpRequestEdit({ id }) {
  const request = getHelpRequest(id)

  if (!request || request.status === 'afgerond') {
    return (
      <section className="request-page">
        <div className="request-panel request-empty">
          <h1>{request ? 'Deze vraag is afgerond' : 'Hulpvraag niet gevonden'}</h1>
          <p>
            {request
              ? 'Afgeronde hulpvragen kunnen niet meer worden bewerkt.'
              : 'Deze vraag bestaat niet meer of is verwijderd.'}
          </p>
          <a className="request-button request-button--primary" href="/mijn-hulpvragen">Terug naar mijn hulpvragen</a>
        </div>
      </section>
    )
  }

  function saveChanges(changes) {
    if (!updateHelpRequest(request.id, changes)) return false
    window.location.assign('/mijn-hulpvragen?melding=bijgewerkt')
    return true
  }

  return (
    <section className="request-page" aria-labelledby="edit-request-title">
      <div className="request-page__heading">
        <p className="request-eyebrow">HULPVRAGEN</p>
        <h1 id="edit-request-title">Hulpvraag bewerken</h1>
        <p>Pas je vraag aan. De status en plaatsingsdatum blijven staan.</p>
      </div>
      <div className="request-panel">
        <HelpRequestForm
          initialValue={request}
          buttonText="Wijzigingen opslaan"
          onSave={saveChanges}
        />
      </div>
    </section>
  )
}
