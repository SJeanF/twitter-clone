import usePaginated from '../hooks/usePaginated'
import UserCard from './UserCard'

export default function UserList({ path, params, emptyText }) {
  const { items, loading, error, hasNext, loadMore } = usePaginated(path, params)

  return (
    <>
      {items.map((person) => (
        <UserCard key={person.id} person={person} />
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