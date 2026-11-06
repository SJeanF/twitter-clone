import usePaginated from '../hooks/usePaginated'
import PostCard from './PostCard'

export default function PostList({ path, params, emptyText }) {
  const { items, setItems, loading, error, hasNext, loadMore } = usePaginated(path, params)

  const update = (post) =>
    setItems((prev) => prev.map((p) => (p.id === post.id ? post : p)))
  const remove = (id) => setItems((prev) => prev.filter((p) => p.id !== id))

  return (
    <>
      {items.map((post) => (
        <PostCard key={post.id} post={post} onUpdate={update} onDelete={remove} />
      ))}
      {error && <p className="error">{error}</p>}
      {loading && <p className="muted center">Carregando...</p>}
      {!loading && !error && items.length === 0 && (
        <p className="muted center">{emptyText}</p>
      )}
      {hasNext && !loading && (
        <button className="secondary" onClick={loadMore}>Carregar mais</button>
      )}
    </>
  )
}