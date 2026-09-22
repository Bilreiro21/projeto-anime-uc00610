import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Detalhes from './pages/Detalhes'
import Favoritos from './pages/Favoritos'
import Animes from './pages/Animes'
import Mangas from './pages/Mangas'

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: {
            background: '#1f1f24',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
          },
        }} 
      />
      <Navbar />
      <div className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/animes" element={<Animes />} />
          <Route path="/mangas" element={<Mangas />} />
          <Route path="/favoritos" element={<Favoritos />} />
          <Route path="/detalhes/:type/:id" element={<Detalhes />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App