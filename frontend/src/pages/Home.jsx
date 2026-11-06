import { useState } from 'react'
import PostForm from '../components/PostForm'
import PostList from '../components/PostList'

export default function Home() {
  const [tab, setTab] = useState('feed')
  const [refresh, setRefresh] = useState(0)
  const [notice, setNotice] = useState('')

  function handleCreated() {
    setRefresh((r) => r + 1) // recarrega a lista atual
    setNotice(
      tab === 'feed'
        ? 'Post publicado! O feed mostra só quem você segue — veja o seu post em "Explorar" ou no seu perfil.'
        : ''
    )
  }

  function changeTab(next) {
    setTab(next)
    setNotice('')
  }

  return (
    <>
      <PostForm onCreated={handleCreated} />
      {notice && <p className="notice">{notice}</p>}

      <div className="tabs">
        <button className={tab === 'feed' ? 'active' : ''} onClick={() => changeTab('feed')}>
          Seguindo
        </button>
        <button className={tab === 'explore' ? 'active' : ''} onClick={() => changeTab('explore')}>
          Explorar
        </button>
      </div>

      {tab === 'feed' ? (
        <PostList
          key={`feed-${refresh}`}
          path="/feed/"
          emptyText="Seu feed está vazio. Siga pessoas na aba Pessoas para ver os posts delas aqui."
        />
      ) : (
        <PostList
          key={`explore-${refresh}`}
          path="/posts/"
          emptyText="Ainda não há posts."
        />
      )}
    </>
  )
}