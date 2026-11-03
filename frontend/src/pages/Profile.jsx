import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api, { errorMessage } from '../api'
import { useAuth } from '../AuthContext'
import Avatar from '../components/Avatar'
import FollowButton from '../components/FollowButton'
import PostList from '../components/PostList'
import UserList from '../components/UserList'

function Profile({ username }) {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('posts')

  useEffect(() => {
    api
      .get(`/users/${username}/`)
      .then(({ data }) => setProfile(data))
      .catch((err) =>
        setError(err.response?.status === 404 ? 'Usuário não encontrado.' : errorMessage(err))
      )
  }, [username])

  if (error) return <p className="error">{error}</p>
  if (!profile) return <p className="muted center">Carregando...</p>

  const isMe = profile.username === user.username

  function handleFollowChange(data) {
    setProfile((p) => ({
      ...p,
      is_following: data.following,
      followers_count: data.followers_count,
    }))
  }

  return (
    <>
      <div className="card profile-header">
        <Avatar src={profile.avatar} name={profile.display_name} size={80} />
        <div className="profile-info">
          <h2>{profile.display_name}</h2>
          <div className="muted">@{profile.username}</div>
        </div>
        {isMe ? (
          <Link to="/settings"><button className="secondary">Editar perfil</button></Link>
        ) : (
          <FollowButton
            username={profile.username}
            isFollowing={profile.is_following}
            onChange={handleFollowChange}
          />
        )}
      </div>

      <div className="tabs">
        <button className={tab === 'posts' ? 'active' : ''} onClick={() => setTab('posts')}>
          {profile.posts_count} posts
        </button>
        <button className={tab === 'followers' ? 'active' : ''} onClick={() => setTab('followers')}>
          {profile.followers_count} seguidores
        </button>
        <button className={tab === 'following' ? 'active' : ''} onClick={() => setTab('following')}>
          {profile.following_count} seguindo
        </button>
      </div>

      {tab === 'posts' && (
        <PostList
          path="/posts/"
          params={{ author: username }}
          emptyText="Nenhum post ainda."
        />
      )}
      {tab === 'followers' && (
        <UserList path={`/users/${username}/followers/`} emptyText="Ninguém segue este usuário ainda." />
      )}
      {tab === 'following' && (
        <UserList path={`/users/${username}/following/`} emptyText="Este usuário não segue ninguém." />
      )}
    </>
  )
}

// O "key" faz o componente reiniciar do zero ao navegar de um perfil para outro
export default function ProfilePage() {
  const { username } = useParams()
  return <Profile key={username} username={username} />
}