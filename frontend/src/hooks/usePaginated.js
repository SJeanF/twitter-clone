import { useEffect, useState } from 'react'
import api, { errorMessage } from '../api'

export default function usePaginated(path, params = {}) {
  const key = path + JSON.stringify(params)
  const [pageState, setPageState] = useState({ key, page: 1 })
  const [version, setVersion] = useState(0)
  const [items, setItems] = useState([])
  const [hasNext, setHasNext] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Se o caminho ou os filtros mudarem, volta automaticamente para a página 1
  const page = pageState.key === key ? pageState.page : 1

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    api
      .get(path, { params: { ...params, page } })
      .then(({ data }) => {
        if (cancelled) return
        setItems((prev) => (page === 1 ? data.results : [...prev, ...data.results]))
        setHasNext(Boolean(data.next))
      })
      .catch((err) => !cancelled && setError(errorMessage(err)))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, page, version])

  const loadMore = () => setPageState({ key, page: page + 1 })
  const reload = () => {
    setPageState({ key, page: 1 })
    setVersion((v) => v + 1)
  }

  return { items, setItems, loading, error, hasNext, loadMore, reload }
}