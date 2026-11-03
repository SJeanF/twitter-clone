import { useState } from 'react'
import { Link } from 'react-router-dom'
import api, { errorMessage } from '../api'
import usePaginated from '../hooks/usePaginated'
import Avatar from './Avatar'

export default function Comments({ postId, onAdded }) {
  const { items, setItems, loading, hasNext, loadMore, reload } =
    usePaginated(`/posts/${postId}/comments/`)
  const [text, setText] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!text.trim()) return
    setError('')
    try {
      const { data } = await api.post(`/posts/${postId}/comments/`, { content: text })
      setText('')
      // Se ainda há páginas por carregar, recarrega; senão, só acrescenta no fim
      if (hasNext) reload()
      else setItems((prev) => [...prev, data])
      onAdded()
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  return (
    <div className="comments">
      {items.map((c) => (
        <div key={c.id} className="comment">
          <Avatar src={c.user_avatar} name={c.user_name} size={30} />
          <div>
            <Link to={`/u/${c.user}`}><strong>{c.user_name}</strong></Link>{' '}
            <span className="muted">@{c.user}</span>
            <div>{c.content}</div>
          </div>
        </div>
      ))}
      {loading && <p className="muted">Carregando...</p>}
      {hasNext && !loading && (
        <button className="secondary small" onClick={loadMore}>Mais comentários</button>
      )}
      <form className="row" onSubmit={handleSubmit}>
        <input
          placeholder="Escreva um comentário..."
          maxLength={280}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button disabled={!text.trim()}>Enviar</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  )
}