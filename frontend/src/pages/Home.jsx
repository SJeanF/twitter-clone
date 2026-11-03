import { useAuth } from '../AuthContext'

export default function Home() {
  const { user, logout } = useAuth()
  return (
    <div className="auth-card">
      <h1>Olá, {user.display_name || user.username}!</h1>
      <p>Login funcionando. O feed vem na próxima etapa.</p>
      <button onClick={logout}>Sair</button>
    </div>
  )
}