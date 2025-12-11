import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// 1. CSS e JS do Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js' 

// 2. O nosso CSS personalizado
import './index.css'

import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)