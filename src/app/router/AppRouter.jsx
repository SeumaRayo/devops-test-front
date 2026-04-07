import { Routes, Route } from 'react-router-dom'

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<div className="flex h-screen items-center justify-center bg-background"><h1 className="text-3xl font-bold text-primary">¡Bienvenido a DevOps Frontend!</h1></div>} />
    </Routes>
  )
}

export default AppRouter
