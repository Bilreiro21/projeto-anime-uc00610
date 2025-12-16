import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Detalhes from './pages/Detalhes'
import Favoritos from './pages/Favoritos'
// IMPORTA AS NOVAS PÁGINAS
import Animes from './pages/Animes'
import Mangas from './pages/Mangas'

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const salvo = localStorage.getItem('theme-dark');
    return salvo === 'true';
  })

  const toggleTheme = () => {
    setDarkMode(!darkMode)
  }

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
      <Toaster position="bottom-right" reverseOrder={false} />
      <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />
      <div className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/animes" element={<Animes />} /> {/* NOVA ROTA */}
          <Route path="/mangas" element={<Mangas />} /> {/* NOVA ROTA */}
          <Route path="/favoritos" element={<Favoritos />} />
          <Route path="/detalhes/:id" element={<Detalhes />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App