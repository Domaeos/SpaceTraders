import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { UserProvider } from './Contexts/UserContext.tsx'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <App />
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
