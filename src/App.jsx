

import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Portal from './pages/Portal.jsx'
import HelpRequests from './pages/HelpRequests.jsx'
import './App.css'
import Register from './pages/Register.jsx'

function App() {
  const path = window.location.pathname

  if (path === '/hulpvragen') {
    return <HelpRequests />
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
