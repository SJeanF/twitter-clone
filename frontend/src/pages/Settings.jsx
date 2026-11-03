import { useMemo, useState } from 'react'
import api, { errorMessage } from '../api'
import { useAuth } from '../AuthContext'
import Avatar from '../components/Avatar'

export default function Settings() {
  const { user, setUser } = useAuth()
  const [displayName, setDisplayName] = useState(user.display_name || '')
  const [avatar, setAvatar] = useState(null)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  const preview = useMemo(
    () => (avatar ? URL.createObjectURL(avatar) : user.avatar),
    [avatar, user.avatar]
  )

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setMessage('')

    const form = new FormData()
    if (displayName !== (user.display_name || '')) form.append('display_name', displayName)
    if (avatar) form.append('avatar', avatar)
    if (newPassword) {
      form.append('current_password', currentPassword)
      form.append('new_password', newPassword)
    } else if (currentPassword) {
      setError('Informe também a nova senha.')
      return
    }

    if ([...form.keys()].length === 0) {
      setError('Nenhuma alteração para salvar.')
      return
    }

    setBusy(true)
    try {
      const { data } = await api.patch('/profile/me/', form)
      setUser(data)
      setAvatar(null)
      setCurrentPassword('')
      setNewPassword('')
      setMessage('Perfil atualizado!')
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <h2>Editar perfil</h2>
      <p className="muted">Altere só o que quiser — nenhum campo é obrigatório.</p>

      <form className="card" onSubmit={handleSubmit}>
        <div className="row">
          <Avatar src={preview} name={displayName || user.username} size={64} />
          <input type="file" accept="image/*" onChange={(e) => setAvatar(e.target.files[0] || null)} />
        </div>

        <label>
          Nome
          <input
            placeholder={user.username}
            maxLength={50}
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </label>

        <label>
          Senha atual
          <input
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </label>

        <label>
          Nova senha
          <input
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </label>

        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}
        <button disabled={busy}>{busy ? 'Salvando...' : 'Salvar alterações'}</button>
      </form>
    </>
  )
}