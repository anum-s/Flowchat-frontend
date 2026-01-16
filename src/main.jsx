import {BrowserRouter} from 'react-router-dom'
import { createRoot } from 'react-dom/client'
// import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {AuthContextProvider} from './context/AuthContext.jsx'
import { SocketContextProvider } from './context/SocketContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <AuthContextProvider>
    <SocketContextProvider>
      <App />
    </SocketContextProvider>   
  </AuthContextProvider>
  </BrowserRouter>,
)   
