import { useRef, useState } from 'react'

const SUBJECTS = [
  'Bedrijfskunde',
  'Databases',
  'Engels',
  'Frontend',
  'Nederlands',
  'Netwerken',
  'Programmeren',
  'Wiskunde',
]

const LANGUAGES = [
  'C#',
  'C++',
  'HTML/CSS',
  'Java',
  'JavaScript',
  'Kotlin',
  'PHP',
  'Python',
  'SQL',
  'Swift',
  'TypeScript',
]

const MAX_DESCRIPTION_LENGTH = 500
const MIN_DESCRIPTION_LENGTH = 10

function validateRequest(request) {
  const errors = {}

  if (!request.titel) errors.titel = 'Geef je vraag een korte titel.'
  if (!request.vak) errors.vak = 'Kies het vak waar je vastloopt.'
  if (!request.contactgegevens.naam) errors.contactNaam = 'Vul je naam in.'
  if (!request.contactgegevens.email) {
    errors.contactEmail = 'Vul je e-mailadres in.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(request.contactgegevens.email)) {
    errors.contactEmail = 'Vul een geldig e-mailadres in.'
  }
  if (!request.omschrijving) {
    errors.omschrijving = 'Beschrijf je probleem, dan weet een peercoach waar hij kan helpen.'
  } else if (request.omschrijving.length < MIN_DESCRIPTION_LENGTH) {
    errors.omschrijving = `Schrijf iets meer, minimaal ${MIN_DESCRIPTION_LENGTH} tekens.`
  }

  return errors
}

export default function HelpRequestForm({
  initialValue = {},
  buttonText = 'Opslaan',
  onSave,
  onCancel,
}) {
  const [request, setRequest] = useState({
    titel: initialValue.titel ?? '',
    vak: initialValue.vak ?? '',
    taal: initialValue.taal ?? '',
    omschrijving: initialValue.omschrijving ?? '',
    contactNaam: initialValue.contactgegevens?.naam ?? '',
    contactEmail: initialValue.contactgegevens?.email ?? '',
    beschikbaarheid: initialValue.contactgegevens?.beschikbaarheid ?? '',
  })
  const [errors, setErrors] = useState({})
  const [saveError, setSaveError] = useState('')
  const fieldRefs = useRef({})

  function handleChange(name) {
    return (event) => {
      setRequest((current) => ({ ...current, [name]: event.target.value }))
      setErrors((current) => ({ ...current, [name]: undefined }))
      setSaveError('')
    }
  }

  function handleSubmit(event) {
    event.preventDefault()

    const cleanedRequest = {
      titel: request.titel.trim(),
      vak: request.vak,
      taal: request.taal,
      omschrijving: request.omschrijving.trim(),
      contactgegevens: {
        naam: request.contactNaam.trim(),
        email: request.contactEmail.trim(),
        beschikbaarheid: request.beschikbaarheid.trim(),
      },
    }
    const nextErrors = validateRequest(cleanedRequest)
    setErrors(nextErrors)

    const firstInvalidField = Object.keys(nextErrors)[0]
    if (firstInvalidField) {
      setSaveError('')
      fieldRefs.current[firstInvalidField]?.focus()
      return
    }

    if (!onSave(cleanedRequest)) {
      setSaveError('Opslaan is niet gelukt. Controleer of er ruimte is in je browser en probeer het opnieuw.')
    }
  }

  return (
    <form className="request-form" noValidate onSubmit={handleSubmit}>
      {saveError && <p className="request-alert" role="alert">{saveError}</p>}

      <div className="request-field">
        <label htmlFor="request-title">Titel</label>
        <input
          ref={(node) => { fieldRefs.current.titel = node }}
          id="request-title"
          type="text"
          value={request.titel}
          placeholder="Bijvoorbeeld: verschil tussen for- en while-loop"
          maxLength={80}
          aria-invalid={Boolean(errors.titel)}
          aria-describedby={errors.titel ? 'request-title-error' : undefined}
          onChange={handleChange('titel')}
        />
        {errors.titel && <p className="request-field__error" id="request-title-error">{errors.titel}</p>}
      </div>

      <div className="request-form__row">
        <div className="request-field">
          <label htmlFor="request-subject">Vak</label>
          <select
            ref={(node) => { fieldRefs.current.vak = node }}
            id="request-subject"
            value={request.vak}
            aria-invalid={Boolean(errors.vak)}
            aria-describedby={errors.vak ? 'request-subject-error' : undefined}
            onChange={handleChange('vak')}
          >
            <option value="">Kies een vak…</option>
            {SUBJECTS.map((subject) => <option key={subject} value={subject}>{subject}</option>)}
          </select>
          {errors.vak && <p className="request-field__error" id="request-subject-error">{errors.vak}</p>}
        </div>

        <div className="request-field">
          <label htmlFor="request-language">Programmeertaal <span>(indien van toepassing)</span></label>
          <select id="request-language" value={request.taal} onChange={handleChange('taal')}>
            <option value="">Niet van toepassing</option>
            {LANGUAGES.map((language) => <option key={language} value={language}>{language}</option>)}
          </select>
          <p className="request-field__hint">Laat dit leeg als je vraag niet over code gaat.</p>
        </div>
      </div>

      <div className="request-field">
        <label htmlFor="request-description">Omschrijving</label>
        <textarea
          ref={(node) => { fieldRefs.current.omschrijving = node }}
          id="request-description"
          value={request.omschrijving}
          placeholder="Wat heb je al geprobeerd en waar loop je vast?"
          maxLength={MAX_DESCRIPTION_LENGTH}
          aria-invalid={Boolean(errors.omschrijving)}
          aria-describedby={errors.omschrijving ? 'request-description-error' : undefined}
          onChange={handleChange('omschrijving')}
        />
        <span className="request-field__counter">{request.omschrijving.length} / {MAX_DESCRIPTION_LENGTH} tekens</span>
        {errors.omschrijving && <p className="request-field__error" id="request-description-error">{errors.omschrijving}</p>}
      </div>

      <fieldset className="request-private-contact">
        <legend>Contactgegevens voor na een goedgekeurde match</legend>
        <p>Deze gegevens zijn niet zichtbaar voor peercoaches of docenten zolang er geen match is goedgekeurd.</p>
        <div className="request-form__row">
          <div className="request-field">
            <label htmlFor="request-contact-name">Naam</label>
            <input
              ref={(node) => { fieldRefs.current.contactNaam = node }}
              id="request-contact-name"
              type="text"
              autoComplete="name"
              value={request.contactNaam}
              maxLength={100}
              aria-invalid={Boolean(errors.contactNaam)}
              aria-describedby={errors.contactNaam ? 'request-contact-name-error' : undefined}
              onChange={handleChange('contactNaam')}
            />
            {errors.contactNaam && <p className="request-field__error" id="request-contact-name-error">{errors.contactNaam}</p>}
          </div>
          <div className="request-field">
            <label htmlFor="request-contact-email">E-mailadres</label>
            <input
              ref={(node) => { fieldRefs.current.contactEmail = node }}
              id="request-contact-email"
              type="email"
              autoComplete="email"
              value={request.contactEmail}
              maxLength={254}
              aria-invalid={Boolean(errors.contactEmail)}
              aria-describedby={errors.contactEmail ? 'request-contact-email-error' : undefined}
              onChange={handleChange('contactEmail')}
            />
            {errors.contactEmail && <p className="request-field__error" id="request-contact-email-error">{errors.contactEmail}</p>}
          </div>
        </div>
        <div className="request-field">
          <label htmlFor="request-availability">Wanneer kun je meestal afspreken? <span>(optioneel)</span></label>
          <input
            id="request-availability"
            type="text"
            value={request.beschikbaarheid}
            placeholder="Bijvoorbeeld: dinsdagmiddag op school"
            maxLength={160}
            onChange={handleChange('beschikbaarheid')}
          />
        </div>
      </fieldset>

      <p className="request-privacy-note">
        Je gegevens worden alleen in deze browser opgeslagen. Deel geen persoonlijke gegevens in de openbare omschrijving.
      </p>
      <div className="request-form__actions">
        {onCancel ? (
          <button className="request-button request-button--secondary" type="button" onClick={onCancel}>Annuleren</button>
        ) : (
          <a className="request-button request-button--secondary" href="/mijn-hulpvragen">Annuleren</a>
        )}
        <button className="request-button request-button--primary" type="submit">{buttonText}</button>
      </div>
    </form>
  )
}
