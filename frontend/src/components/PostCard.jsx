import { useState } from 'react'
import { Link } from 'react-router-dom'
import api, { errorMessage } from '../api'
import { useAuth } from '../AuthContext'
import Avatar from './Avatar'
import Comments from './Comments'

export default function PostCard({ post, onUpdate, onDelete }) {
  const { user } = useAuth()
  const [showComments, setShowComments] = useState(false)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(post.content)
  const [error, setError] = useState('')
  const isOwner = user.username === post.author

  async function toggleLike() {
    try {
      const { data } = post.liked_by_me
        ? await api.delete(`/posts/${post.id}/like/`)
        : await api.post(`/posts/${post.id}/like/`)
      onUpdate({ ...post, liked_by_me: data.liked, likes_count: data.likes_count })
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  async function saveEdit() {
    try {
      const { data } = await api.patch(`/posts/${post.id}/`, { content: draft })
      onUpdate(data)
      setEditing(false)
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  async function remove() {
    if (!window.confirm('Apagar este post?')) return
    try {
      await api.delete(`/posts/${post.id}/`)
      onDelete(post.id)
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  return (
    <article className="card post">
      <Link to={`/u/${post.author}`}>
        <Avatar src={post.author_avatar} name={post.author_name} />
      </Link>

      <div className="post-body">
        <div className="post-header">
          <Link to={`/u/${post.author}`}><strong>{post.author_name}</strong></Link>
          <span className="muted">@{post.author}</span>
          <span className="muted">· {new Date(post.created_at).toLocaleString('pt-BR')}</span>
        </div>

        {editing ? (
          <>
            <textarea
              rows={3}
              maxLength={280}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
            <div className="actions">
              <button className="small" onClick={saveEdit} disabled={!draft.trim()}>Salvar</button>
              <button
                className="secondary small"
                onClick={() => { setEditing(false); setDraft(post.content) }}
              >
                Cancelar
              </button>
            </div>
          </>
        ) : (
          <p className="post-text">{post.content}</p>
        )}

        {error && <p className="error">{error}</p>}

        <div className="actions">
          <button className="link-button" onClick={toggleLike}>
            {post.liked_by_me ? '♥' : '♡'} {post.likes_count}
          </button>
          <button className="link-button" onClick={() => setShowComments((s) => !s)}>
            💬 {post.comments_count}
          </button>
          {isOwner && !editing && (
            <>
              <button className="link-button" onClick={() => setEditing(true)}>Editar</button>
              <button className="link-button danger" onClick={remove}>Apagar</button>
            </>
          )}
        </div>

        {showComments && (
          <Comments
            postId={post.id}
            onAdded={() => onUpdate({ ...post, comments_count: post.comments_count + 1 })}
          />
        )}
      </div>
    </article>
  )
}