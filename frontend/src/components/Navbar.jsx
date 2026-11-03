import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import Avatar from './Avatar'

export default function Navbar() {
  const { user, logout } = useAuth()
  const name = user.display_name || user.username

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" end>Início</NavLink>
        <NavLink to="/users">Pessoas</NavLink>
        <NavLink to={`/u/${user.username}`}>Perfil</NavLink>
        <span className="spacer" />
        <Link to="/settings" title="Editar perfil">
          <Avatar src={user.avatar} name={name} size={32} />
        </Link>
        <button className="secondary small" onClick={logout}>Sair</button>
      </div>
    </nav>
  )
}