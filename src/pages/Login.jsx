import { useEffect, useState } from 'react'
import './Login.css'
import logo from '../assets/logo.png'

const isStudentEmail = (value) => /^[^\s@]+@student\.zadkine\.nl$/i.test(value)
const isTeacherEmail = (value) => /^[^\s@]+@tcrmbo\.nl$/i.test(value)

const Login = () => {
  const [email, setEmail] = useState(
    localStorage.getItem('email') || sessionStorage.getItem('email') || '',
  )
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(localStorage.getItem('rememberMe') === 'true')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const savedEmail = localStorage.getItem('email') || ''
    const shouldRemember = localStorage.getItem('rememberMe') === 'true'

    if (shouldRemember && savedEmail && (isStudentEmail(savedEmail) || isTeacherEmail(savedEmail))) {
      window.location.assign('/portaal')
    }
  }, [])

  const handleLogin = (event) => {
    event.preventDefault()

    const normalizedEmail = email.trim().toLowerCase()
    const isStudent = isStudentEmail(normalizedEmail)
    const isTeacher = isTeacherEmail(normalizedEmail)

    if (!isStudent && !isTeacher) {
      setError('Gebruik je schoolaccount: naam@student.zadkine.nl of je docentaccount @tcrmbo.nl.')
      return
    }

    if (!password) {
      setError('Vul je wachtwoord in.')
      return
    }

    if (rememberMe) {
      localStorage.setItem('email', normalizedEmail)
      localStorage.setItem('rememberMe', 'true')
      sessionStorage.removeItem('email')
    } else {
      sessionStorage.setItem('email', normalizedEmail)
      localStorage.removeItem('rememberMe')
      localStorage.removeItem('email')
    }

    window.location.assign('/portaal')
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <img src={logo} alt="PeerCoach" />
        <p className="login-form__eyebrow">TECHNIEK COLLEGE ROTTERDAM</p>
        <h1>Welkom terug</h1>
        <p className="login-form__intro">Log in met je schoolaccount om naar jouw portaal te gaan.</p>

        <label htmlFor="email">E-mailadres</label>
        <input
          type="email"
          id="email"
          autoComplete="username"
          placeholder="naam@student.zadkine.nl"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value)
            setError('')
          }}
          required
        />

        <label htmlFor="wachtwoord">Wachtwoord</label>
        <div className="login-form__password">
          <input
            type={showPassword ? 'text' : 'password'}
            id="wachtwoord"
            autoComplete="current-password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value)
              setError('')
            }}
            required
          />
          <button
            className="login-form__password-toggle"
            type="button"
            aria-label={showPassword ? 'Wachtwoord verbergen' : 'Wachtwoord tonen'}
            aria-pressed={showPassword}
            onClick={() => setShowPassword((visible) => !visible)}
          >
            <svg
              viewBox="0 0 24 24"
              width="19"
              height="19"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {showPassword ? (
                <>
                  <path d="M3 3l18 18" />
                  <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                  <path d="M9.9 5.2A10.7 10.7 0 0 1 12 5c5.2 0 8.7 4.2 9.5 6-.3.7-1.1 1.8-2.3 2.9" />
                  <path d="M6.2 6.2C4.2 7.4 2.9 9.3 2.5 11c.8 1.8 4.3 8 9.5 8 1.2 0 2.3-.3 3.3-.8" />
                </>
              ) : (
                <>
                  <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </>
              )}
            </svg>
          </button>
        </div>

        <label className="login-form__remember" htmlFor="remember-me">
          <input
            id="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
          />
          <span>Onthoud mij</span>
        </label>

        {error && <p className="login-form__error" role="alert">{error}</p>}
        <button type="submit">Inloggen <span aria-hidden="true">→</span></button>
        <p className="login-form__demo">
          Demoportaal: je wachtwoord wordt niet gecontroleerd. Gebruik een schoolmailadres om de juiste rol te zien.
        </p>
      </form>
    </div>
  )
}

export default Login