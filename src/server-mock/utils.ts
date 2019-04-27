import { SortOrder } from "../gen/types"
import { INode } from "./db"

export function sort<T>(list: T[], sortKey: keyof T, sortOrder: SortOrder) {
  return list.slice().sort((a, b) => {
    if (a[sortKey] === b[sortKey]) {
      return 0
    } else if (sortOrder === SortOrder.Asc) {
      return a[sortKey] > b[sortKey] ? 1 : -1
    } else {
      return a[sortKey] < b[sortKey] ? 1 : -1
    }
  })
}

export function paginate(nodes: INode[], first?: number, after?: string) {
  const edges = nodes.map(node => ({ cursor: btoa(node.id), node }))
  let start = 0
  if (after) {
    const prevIndex = edges.findIndex(edge => edge.cursor === after)
    if (prevIndex === undefined) {
      throw new Error(
        "The supplied 'after' cursor doesn't exist in the requested list",
      )
    }
    start = prevIndex + 1
  }
  const end =
    first === undefined ? edges.length : Math.min(start + first, edges.length)
  const page = edges.slice(start, end)
  return {
    totalCount: edges.length,
    edges: page,
    pageInfo: {
      endCursor: (page.length && page[page.length - 1].cursor) || null,
      hasNextPage: end < edges.length,
    },
  }
}
