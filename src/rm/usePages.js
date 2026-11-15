import { useCallback, useEffect, useState } from 'react'
import { api } from '../api.js'

export function usePages() {
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const data = await api.getPages()
    setPages(data)
    setLoading(false)
    return data
  }, [])

  useEffect(() => {
    refresh().catch(() => {
      setPages([])
      setLoading(false)
    })
  }, [refresh])

  function pageTitle(id) {
    return pages.find((p) => p.id === id)?.title ?? id
  }

  return { pages, loading, pageTitle, refresh }
}
