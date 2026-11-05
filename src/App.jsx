

import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import './App.css'

function App() {
  const isLoginPage = window.location.pathname === '/login'

  return (
    <div className="app-shell">
      <Navbar />
      <div className="page-content">{isLoginPage ? <Login /> : <Home />}</div>
      <Footer />
    </div>
  )
}

export default App
