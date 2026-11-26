import HelpRequestForm from '../components/HelpRequestForm.jsx'
import { saveHelpRequest } from '../utils/helpRequestStorage.js'

export default function HelpRequestNew({ embedded = false, onComplete, onCancel }) {
  function saveRequest(request) {
    if (!saveHelpRequest(request)) return false

    if (onComplete) {
      onComplete()
    } else {
      window.location.assign('/mijn-hulpvragen?melding=geplaatst')
    }

    return true
  }

  return (
    <section className={`request-page${embedded ? ' request-page--embedded' : ''}`} aria-labelledby="new-request-title">
      <div className="request-page__heading">
        <p className="request-eyebrow">HULPVRAGEN</p>
        <h1 id="new-request-title">Nieuwe hulpvraag</h1>
        <p>Vertel waar je vastloopt. Een duidelijke vraag helpt een peercoach om met je mee te denken.</p>
      </div>
      <div className="request-panel">
        <HelpRequestForm buttonText="Vraag plaatsen" onSave={saveRequest} onCancel={onCancel} />
      </div>
    </section>
  )
}
