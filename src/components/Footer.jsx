import logo from '../assets/logo.png'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="footer__main">
        <a className="footer__brand" href="/" aria-label="PeerCoach, home">
          <img className="footer__logo" src={logo} alt="" />
          <span>
            <strong>PeerCoach</strong>
            <small>Techniek College Rotterdam</small>
          </span>
        </a>
        <p className="footer__message">
          Samen leren, kennis delen en elkaar verder helpen.
        </p>
        <div className="footer__links" aria-label="Footer navigatie">
          <a href="/#hoe-werkt-het">Hoe werkt het?</a>
          <a href="/#voor-wie">Voor wie?</a>
          <a href="/login">Inloggen</a>
        </div>
      </div>
      <div className="footer__bottom">
        <span>© {new Date().getFullYear()} Techniek College Rotterdam</span>
        <span>Een plek om samen verder te komen.</span>
      </div>
    </footer>
  )
}

export default Footer
