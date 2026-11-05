import Header from '../components/Header.jsx'
import './Home.css'

const benefits = [
  {
    number: '01',
    title: 'Vind hulp die bij je past',
    description:
      'Koppel met een medestudent die jouw opleiding en uitdagingen begrijpt. Samen kom je sneller tot een oplossing.',
    icon: '↗',
  },
  {
    number: '02',
    title: 'Deel wat jij al weet',
    description:
      'Heb jij iets onder de knie? Help een ander op weg en ontdek hoeveel je zelf leert door kennis te delen.',
    icon: '✳',
  },
  {
    number: '03',
    title: 'Groei op jouw manier',
    description:
      'Stel vragen, oefen samen en bouw aan je zelfvertrouwen. In jouw tempo en met elkaar.',
    icon: '＋',
  },
]

function Home() {
  return (
    <div className="home-page">
      <Header />

      <section className="how-it-works" id="hoe-werkt-het">
        <div className="section-heading">
          <p className="section-heading__eyebrow">SAMEN STA JE STERKER</p>
          <h2>Iedereen heeft iets te delen.</h2>
          <p>
            Of je nu hulp zoekt of juist iets wilt uitleggen: bij PeerCoach help je elkaar
            vooruit.
          </p>
        </div>
        <div className="benefit-grid" id="voor-wie">
          {benefits.map((benefit) => (
            <article className="benefit-card" key={benefit.number}>
              <div className="benefit-card__top">
                <span className="benefit-card__icon" aria-hidden="true">
                  {benefit.icon}
                </span>
                <span className="benefit-card__number">{benefit.number}</span>
              </div>
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
              <a className="benefit-card__link" href="/login">
                Ontdek PeerCoach <span aria-hidden="true">→</span>
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="home-cta">
        <div>
          <p className="home-cta__eyebrow">KLAAR OM TE BEGINNEN?</p>
          <h2>Je hoeft het niet alleen te doen.</h2>
          <p>Log in en ontdek hoe je samen met andere studenten verder komt.</p>
        </div>
        <a className="button button--light" href="/login">
          Ga naar PeerCoach <span aria-hidden="true">→</span>
        </a>
      </section>
    </div>
  )
}

export default Home
