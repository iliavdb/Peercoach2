import HelpRequestForm from '../components/HelpRequestForm.jsx'
import { saveHelpRequest } from '../utils/helpRequestStorage.js'

export default function HelpRequestNew() {
  function saveRequest(request) {
    if (!saveHelpRequest(request)) return false
    window.location.assign('/mijn-hulpvragen?melding=geplaatst')
    return true
  }

  return (
    <section className="request-page" aria-labelledby="new-request-title">
      <div className="request-page__heading">
        <p className="request-eyebrow">HULPVRAGEN</p>
        <h1 id="new-request-title">Nieuwe hulpvraag</h1>
        <p>Vertel waar je vastloopt. Een duidelijke vraag helpt een peercoach om met je mee te denken.</p>
      </div>
      <div className="request-panel">
        <HelpRequestForm buttonText="Vraag plaatsen" onSave={saveRequest} />
      </div>
    </section>
  )
}
