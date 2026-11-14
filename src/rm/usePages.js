import { useEffect, useState } from 'react'
import { api } from '../api.js'

export function usePages() {
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    api
      .getPages()
      .then((data) => {
        if (alive) setPages(data)
      })
      .catch(() => {
        if (alive) setPages([])
      })
      .finally(() => {
        if (alive) setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [])

  function pageTitle(id) {
    return pages.find((p) => p.id === id)?.title ?? id
  }

  return { pages, loading, pageTitle }
}
