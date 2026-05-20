import { BrowserRouter } from 'react-router-dom'
import AppRouter from './app/router/AppRouter'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRouter />
        <Toaster
          position="top-right"
          richColors
          closeButton
          theme="dark"
          toastOptions={{
            style: {
              background: '#1f2937',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#e5e7eb',
            },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
