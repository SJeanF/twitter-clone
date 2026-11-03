import { Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import Avatar from './Avatar'
import FollowButton from './FollowButton'

export default function UserCard({ person }) {
  const { user } = useAuth()

  return (
    <div className="card user-card">
      <Link to={`/u/${person.username}`} className="user-info">
        <Avatar src={person.avatar} name={person.display_name} />
        <div>
          <strong>{person.display_name}</strong>
          <div className="muted">@{person.username}</div>
        </div>
      </Link>
      {person.username !== user.username && (
        <FollowButton username={person.username} isFollowing={person.is_following} />
      )}
    </div>
  )
}