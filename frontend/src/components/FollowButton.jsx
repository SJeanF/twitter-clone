import { useState } from 'react'
import api from '../api'

export default function FollowButton({ username, isFollowing, onChange }) {
  const [following, setFollowing] = useState(isFollowing)
  const [busy, setBusy] = useState(false)

  async function toggle() {
    setBusy(true)
    try {
      const { data } = following
        ? await api.delete(`/users/${username}/follow/`)
        : await api.post(`/users/${username}/follow/`)
      setFollowing(data.following)
      onChange?.(data)
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      className={following ? 'secondary' : ''}
      onClick={toggle}
      disabled={busy}
    >
      {following ? 'Seguindo' : 'Seguir'}
    </button>
  )
}