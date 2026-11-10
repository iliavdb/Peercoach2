import { useEffect, useRef, useState } from 'react';

const SCHOOL_DOMAIN = '@student.zadkine.nl';

const ROLES = [
  {
    value: 'student',
    title: 'Student',
    description: 'Ik zoek hulp of begeleiding van een peercoach.',
  },
  {
    value: 'peercoach',
    title: 'Peercoach',
    description: 'Ik wil andere studenten helpen met mijn ervaring.',
  },
];

const isSchoolEmail = (email) =>
  email.trim().toLowerCase().endsWith(SCHOOL_DOMAIN);

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState(null);
  const feedbackRef = useRef(null);

  useEffect(() => {
    if (feedback) {
      feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [feedback]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFeedback(null);
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Voornaam is verplicht';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Achternaam is verplicht';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail is verplicht';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Voer een geldig e-mailadres in';
    } else if (!isSchoolEmail(formData.email)) {
      newErrors.email = `Gebruik je schoolmail van Zadkine (${SCHOOL_DOMAIN})`;
    }

    if (!formData.role) {
      newErrors.role = 'Kies of je student of peercoach bent';
    }

    if (!formData.password) {
      newErrors.password = 'Wachtwoord is verplicht';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Wachtwoord moet minimaal 8 tekens bevatten';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Bevestig je wachtwoord';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Wachtwoorden komen niet overeen';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      console.log('Registratiegegevens:', formData);
      // Hier kun je later je API-call toevoegen
      setFeedback({
        type: 'success',
        title: 'Registratie succesvol!',
        text: `Welkom ${formData.firstName}! Je account als ${
          formData.role === 'peercoach' ? 'peercoach' : 'student'
        } is aangemaakt.`,
      });
      setErrors({});
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        role: '',
        password: '',
        confirmPassword: '',
      });
    } else {
      setFeedback({
        type: 'error',
        title: 'Registratie niet gelukt',
        text: 'Controleer de gemarkeerde velden en probeer het opnieuw.',
      });
    }
  };

  return (
    <section className="register-section">
      <div className="register-container">
        <h1>Registreren</h1>
        <p className="register-subtitle">Maak een account aan om gebruik te maken van Peercoach</p>

        {feedback && (
          <div
            ref={feedbackRef}
            className={`feedback feedback--${feedback.type}`}
            role={feedback.type === 'error' ? 'alert' : 'status'}
            aria-live="polite"
          >
            <span className="feedback-icon" aria-hidden="true">
              {feedback.type === 'success' ? '✓' : '!'}
            </span>
            <span className="feedback-content">
              <strong>{feedback.title}</strong>
              <span>{feedback.text}</span>
            </span>
            <button
              type="button"
              className="feedback-close"
              onClick={() => setFeedback(null)}
              aria-label="Melding sluiten"
            >
              ×
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form" noValidate>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">Voornaam</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={errors.firstName ? 'input-error' : ''}
              />
              {errors.firstName && <span className="error-text">{errors.firstName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Achternaam</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={errors.lastName ? 'input-error' : ''}
              />
              {errors.lastName && <span className="error-text">{errors.lastName}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Schoolmail</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'input-error' : ''}
              placeholder={`naam${SCHOOL_DOMAIN}`}
              aria-describedby="email-hint"
            />
            <span id="email-hint" className="hint-text">
              Alleen e-mailadressen van Zadkine ({SCHOOL_DOMAIN}) zijn toegestaan.
            </span>
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <fieldset className="form-group role-fieldset">
            <legend>Ik ben een</legend>
            <div className="role-options">
              {ROLES.map((role) => (
                <label
                  key={role.value}
                  className={`role-option${formData.role === role.value ? ' role-option--selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={role.value}
                    checked={formData.role === role.value}
                    onChange={handleChange}
                  />
                  <span className="role-content">
                    <span className="role-title">{role.title}</span>
                    <span className="role-description">{role.description}</span>
                  </span>
                </label>
              ))}
            </div>
            {errors.role && <span className="error-text">{errors.role}</span>}
          </fieldset>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Wachtwoord</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'input-error' : ''}
                placeholder="Minimaal 8 tekens"
              />
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Bevestig wachtwoord</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? 'input-error' : ''}
                placeholder="Herhaal wachtwoord"
              />
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>
          </div>

          <button type="submit" className="register-button">
            Account aanmaken
          </button>
        </form>

        <p className="login-link">
          Heb je al een account? <a href="#">Inloggen</a>
        </p>
      </div>
    </section>
  );
};

export default Register;
