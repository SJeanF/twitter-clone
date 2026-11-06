import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { errorMessage } from '../api'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await login(username, password)
      navigate('/')
    } catch (err) {
      setError(
        err.response?.status === 401
          ? 'Usuário ou senha incorretos.'
          : errorMessage(err)
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-card">
      <h1>Entrar</h1>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <button disabled={busy}>{busy ? 'Entrando...' : 'Entrar'}</button>
      </form>
      <p>
        Não tem conta? <Link to="/register">Cadastre-se</Link>
      </p>
    </div>
  )
}