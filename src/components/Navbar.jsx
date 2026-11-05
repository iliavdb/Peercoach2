import { useState } from 'react'
import logo from '../assets/logo.png'
import './Navbar.css'

const links = [
  { href: '/#hoe-werkt-het', label: 'Hoe werkt het?' },
  { href: '/#voor-wie', label: 'Voor wie?' },
  { href: '/#contact', label: 'Contact' },
]

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <nav className="navbar" aria-label="Hoofdnavigatie">
      <div className="navbar__inner">
        <a className="navbar__brand" href="/" onClick={closeMenu} aria-label="PeerCoach, home">
          <img className="navbar__logo" src={logo} alt="" />
          <span className="navbar__brand-copy">
            <span className="navbar__name">PeerCoach</span>
            <span className="navbar__school">Techniek College Rotterdam</span>
          </span>
        </a>

        <button
          className={`navbar__toggle${menuOpen ? ' navbar__toggle--open' : ''}`}
          type="button"
          aria-label={menuOpen ? 'Menu sluiten' : 'Menu openen'}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((isOpen) => !isOpen)}
        >
          <span />
          <span />
          <span />
        </button>

        <div
          className={`navbar__links${menuOpen ? ' navbar__links--open' : ''}`}
          id="primary-navigation"
        >
          {links.map((link) => (
            <a className="navbar__link" href={link.href} key={link.href} onClick={closeMenu}>
              {link.label}
            </a>
          ))}
          <a className="navbar__login" href="/login" onClick={closeMenu}>
            Inloggen <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
