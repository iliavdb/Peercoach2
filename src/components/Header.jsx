import './Header.css'

function Header() {
  return (
    <header className="hero">
      <div className="hero__inner">
        <div className="hero__content">
          <p className="hero__eyebrow">
            <span className="hero__eyebrow-dot" aria-hidden="true" />
            Samen kom je verder
          </p>
          <h1>
            Leren doe je
            <br />
            <span>samen.</span>
          </h1>
          <p className="hero__description">
            Loop je ergens op vast, of heb je juist kennis om te delen? Op PeerCoach vind je
            makkelijk een medestudent die je verder helpt.
          </p>
          <div className="hero__actions">
            <a className="button button--primary" href="/login">
              Vind een peercoach <span aria-hidden="true">→</span>
            </a>
            <a className="button button--quiet" href="#hoe-werkt-het">
              Ontdek hoe het werkt
            </a>
          </div>
          <div className="hero__trust">
            <div className="hero__avatars" aria-hidden="true">
              <span>M</span>
              <span>J</span>
              <span>A</span>
              <span>+</span>
            </div>
            <p>
              <strong>Voor en door studenten</strong>
              <span>van Techniek College Rotterdam</span>
            </p>
          </div>
        </div>

        <div className="hero__visual" aria-label="Samen leren op PeerCoach">
          <div className="hero__visual-glow" />
          <div className="hero__visual-grid" />
          <div className="hero__floating hero__floating--top">
            <span className="hero__floating-icon hero__floating-icon--orange" aria-hidden="true">
              ↗
            </span>
            <span>
              <strong>Blijf groeien</strong>
              <small>Stap voor stap</small>
            </span>
          </div>
          <div className="hero__learning-card">
            <div className="hero__card-heading">
              <span className="hero__card-icon" aria-hidden="true">
                ✳
              </span>
              <span className="hero__card-label">JOUW LEERROUTE</span>
              <span className="hero__card-dots" aria-hidden="true">
                ···
              </span>
            </div>
            <h2>Techniek leer je samen</h2>
            <p>Deel je kennis, help elkaar vooruit en haal meer uit je opleiding.</p>
            <div className="hero__progress-label">
              <span>Voortgang</span>
              <strong>75%</strong>
            </div>
            <div className="hero__progress">
              <span />
            </div>
            <div className="hero__card-footer">
              <div className="hero__mini-avatars" aria-hidden="true">
                <span>R</span>
                <span>S</span>
                <span>T</span>
              </div>
              <span>Leer samen met je klas</span>
            </div>
          </div>
          <div className="hero__floating hero__floating--bottom">
            <span className="hero__online-dot" aria-hidden="true" />
            <span>
              <strong>Hulp dichtbij</strong>
              <small>Van een medestudent</small>
            </span>
          </div>
          <span className="hero__spark hero__spark--one" aria-hidden="true">✦</span>
          <span className="hero__spark hero__spark--two" aria-hidden="true">✳</span>
        </div>
      </div>
    </header>
  )
}

export default Header
