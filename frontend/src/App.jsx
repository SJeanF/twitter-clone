import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './AuthContext'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <p className="center">Carregando...</p>
  return user ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <p className="center">Carregando...</p>
  return user ? <Navigate to="/" replace /> : children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}