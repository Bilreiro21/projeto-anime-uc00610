import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast' // <--- IMPORTANTE

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Detalhes from './pages/Detalhes'
import Favoritos from './pages/Favoritos'

function App() {
  // Lê do localStorage se o utilizador já tinha escolhido Dark Mode
  const [darkMode, setDarkMode] = useState(() => {
    const salvo = localStorage.getItem('theme-dark');
    return salvo === 'true'; // Converte string para boolean
  })

  const toggleTheme = () => {
    setDarkMode(!darkMode)
  }

  // Aplica a classe ao body sempre que muda
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
    localStorage.setItem('theme-dark', darkMode);
  }, [darkMode])

  return (
    <div className={`d-flex flex-column min-vh-100 ${darkMode ? 'dark-mode' : ''}`}>
      
      {/* O Carteiro das Notificações */}
      <Toaster position="bottom-right" reverseOrder={false} />

      <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />
      
      <div className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favoritos" element={<Favoritos />} />
          <Route path="/detalhes/:id" element={<Detalhes />} />
        </Routes>
      </div>

      <Footer />
    </div>
  )
}

export default App