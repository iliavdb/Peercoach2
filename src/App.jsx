

import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Portal from './pages/Portal.jsx'
import HelpRequests from './pages/HelpRequests.jsx'
import './App.css'
import Register from './pages/Register.jsx'
import HelpRequestNew from './pages/HelpRequestNew.jsx'
import HelpRequestOverview from './pages/HelpRequestOverview.jsx'
import HelpRequestEdit from './pages/HelpRequestEdit.jsx'
import './pages/RequestPages.css'

function App() {
  const path = window.location.pathname
  const editMatch = path.match(/^\/hulpvraag\/([^/]+)\/bewerk$/)

  if (path === '/hulpvragen') {
    return <HelpRequests />
  }

  if (path === '/mijn-hulpvragen') {
    return (
      <div className="app-shell">
        <Navbar />
        <div className="page-content">
          <HelpRequestOverview />
        </div>
        <Footer />
      </div>
    )
  }

  if (path === '/hulpvraag/nieuw') {
    return (
      <div className="app-shell">
        <Navbar />
        <div className="page-content">
          <HelpRequestNew />
        </div>
        <Footer />
      </div>
    )
  }

  if (editMatch) {
    return (
      <div className="app-shell">
        <Navbar />
        <div className="page-content">
          <HelpRequestEdit id={editMatch[1]} />
        </div>
        <Footer />
      </div>
    )
  }

  if (path === '/register') {
    return <Register />
  }

  if (path === '/portaal') {
    return <Portal />
  }

  return (
    <div className="app-shell">
      <Navbar />
      <div className="page-content">{path === '/login' ? <Login /> : <Home />}</div>
      <Footer />
    </div>
  )
}

export default App
