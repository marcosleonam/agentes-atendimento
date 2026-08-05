import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Anti-enquadramento: se a página for aberta dentro de um iframe de terceiro
// (golpe de sobreposição de clique), ela se joga pra fora. Fica aqui, e não
// como script inline no HTML, porque o CSP bloqueia inline — e afrouxar o CSP
// pra permitir inline abriria a porta que ele existe pra fechar.
if (window.top !== window.self) {
  window.top.location = window.self.location
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
