import { BrowserRouter } from 'react-router-dom'
import AppRouter from './app/router/AppRouter'

function App() {
  return (
    <BrowserRouter>
      {/* Aqui luego agregaremos los Providers (QueryProvider, ThemeProvider, AuthProvider) */}
      <AppRouter />
    </BrowserRouter>
  )
}

export default App
