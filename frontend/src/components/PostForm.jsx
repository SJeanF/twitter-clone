import { useState } from 'react'
import api, { errorMessage } from '../api'

export default function PostForm({ onCreated }) {
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!content.trim()) return
    setError('')
    setBusy(true)
    try {
      await api.post('/posts/', { content })
      setContent('')
      onCreated()
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <textarea
        rows={3}
        maxLength={280}
        placeholder="O que está acontecendo?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      {error && <p className="error">{error}</p>}
      <div className="form-footer">
        <span className="muted">{content.length}/280</span>
        <button disabled={busy || !content.trim()}>Postar</button>
      </div>
    </form>
  )
}