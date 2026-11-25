import { useEffect, useState } from 'react'
import './Login.css'
import logo from '../assets/logo.png'
import { demoAccounts, demoPassword } from '../data/demoUsers.js'

const isStudentEmail = (value) => /^[^\s@]+@student\.zadkine\.nl$/i.test(value)
const isTeacherEmail = (value) => /^[^\s@]+@tcrmbo\.nl$/i.test(value)

const Login = () => {
  const [email, setEmail] = useState(localStorage.getItem('email') || sessionStorage.getItem('email') || '')
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

    const isDemoAccount = demoAccounts.some((account) => account.email === normalizedEmail)
    if (isDemoAccount && password !== demoPassword) {
      setError('Voor beide voorbeeldaccounts is het wachtwoord: peercoach.')
      return
    }

    if (rememberMe) {
      localStorage.setItem('email', normalizedEmail)
      localStorage.setItem('rememberMe', 'true')
      sessionStorage.removeItem('email')
    } else {
      localStorage.removeItem('rememberMe')
      localStorage.removeItem('email')
      sessionStorage.setItem('email', normalizedEmail)
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
        <div className="login-form__examples">
          <p>Bekijk een voorbeeldrol</p>
          {demoAccounts.map((account) => (
            <button
              className="login-form__example"
              type="button"
              key={account.email}
              onClick={() => {
                setEmail(account.email)
                setPassword('peercoach')
                setError('')
              }}
            >
              <span><strong>{account.name}</strong><small>{account.role === 'student' ? 'Student' : 'Docent'} · {account.email}</small></span>
              <span aria-hidden="true">→</span>
            </button>
          ))}
          <p className="login-form__demo">
            Voor beide voorbeeldaccounts is het wachtwoord: <strong>peercoach</strong>.
          </p>
        </div>
      </form>
    </div>
  )
}

export default Login