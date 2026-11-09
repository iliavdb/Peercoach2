import { useEffect, useState } from 'react'
import './Login.css'
import logo from '../assets/logo.png'

const isStudentEmail = (value) => /^[^\s@]+@student\.zadkine\.nl$/i.test(value)
const isTeacherEmail = (value) => /^[^\s@]+@tcrmbo\.nl$/i.test(value)

const Login = () => {
  const [email, setEmail] = useState(localStorage.getItem('email') || '')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(localStorage.getItem('rememberMe') === 'true')
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

    localStorage.setItem('email', normalizedEmail)

    if (rememberMe) {
      localStorage.setItem('rememberMe', 'true')
    } else {
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
        <input
          type="password"
          id="wachtwoord"
          autoComplete="current-password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value)
            setError('')
          }}
          required
        />

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