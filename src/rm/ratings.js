/** Average from reviews assigned to this page only. */
export function pageAverage(reviews, pageId) {
  const list = reviews.filter((r) => r.pageIds.includes(pageId))
  if (list.length === 0) return null

  const sum = list.reduce((s, r) => s + r.rating, 0)
  const average = sum / list.length
  return {
    average,
    count: list.length,
    display: Math.round(average * 10) / 10,
  }
}

// ponytail: self-check — fails loudly if formula breaks
if (import.meta.env?.DEV) {
  const demo = [
    { rating: 5, pageIds: ['a'] },
    { rating: 4, pageIds: ['a'] },
    { rating: 5, pageIds: ['a', 'b'] },
  ]
  const a = pageAverage(demo, 'a')
  const b = pageAverage(demo, 'b')
  const empty = pageAverage(demo, 'z')
  console.assert(a?.display === 4.7 && a.count === 3, 'page a avg')
  console.assert(b?.display === 5 && b.count === 1, 'page b avg')
  console.assert(empty === null, 'empty page')
}
