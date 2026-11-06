import { useState } from 'react'
import UserList from '../components/UserList'

export default function Users() {
  const [input, setInput] = useState('')
  const [search, setSearch] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    setSearch(input.trim())
  }

  return (
    <>
      <h2>Pessoas</h2>
      <form className="row" onSubmit={handleSubmit}>
        <input
          placeholder="Buscar por nome de usuário..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button>Buscar</button>
      </form>
      <UserList path="/users/" params={{ search }} emptyText="Nenhum usuário encontrado." />
    </>
  )
}