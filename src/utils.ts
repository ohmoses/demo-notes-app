import format from "date-fns/format"
import isToday from "date-fns/is_today"
import { useCallback } from "react"
import { useMappedState } from "redux-react-hook"

import { INode } from "./server-mock/db"
import { State } from "./store"

export enum SortBy {
  CreatedAt = "createdAt",
  ModifiedAt = "modifiedAt",
  Title = "title",
}

export enum SortOrder {
  Asc = "ASC",
  Desc = "DESC",
}

export type Maybe<T> = T | null
export type ID = string

export function sort<T>(list: T[], sortKey: keyof T, sortOrder: SortOrder) {
  return list.slice().sort((objA, objB) => {
    const a = objA[sortKey]
    const b = objB[sortKey]

    // Sort strings
    if (typeof a === "string" && typeof b === "string") {
      return (
        a.localeCompare(b, "en", { sensitivity: "accent" }) *
        (sortOrder === SortOrder.Desc ? -1 : 1)
      )
    }
    // Sort other things
    if (a === b) {
      return 0
    } else if (sortOrder === SortOrder.Asc) {
      return a > b ? 1 : -1
    } else {
      return a < b ? 1 : -1
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

export function debounce<T>(fn: (...args: T[]) => void, wait: number) {
  let timeout: Maybe<NodeJS.Timeout>
  return (...args: T[]): void => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), wait)
  }
}

export function debounceWithOnStart<T>(
  onStart: (...args: T[]) => void,
  fn: (...args: T[]) => void,
  wait: number,
) {
  let timeout: Maybe<NodeJS.Timeout> = null
  return (...args: T[]): void => {
    if (timeout === null) {
      onStart(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      fn(...args)
      timeout = null
    }, wait)
  }
}

export enum WindowSize {
  XSmall,
  Small,
  Medium,
  Large,
  XLarge,
}

export function pixelsToSize(px: number): WindowSize {
  return px < 425
    ? WindowSize.XSmall
    : px < 768
    ? WindowSize.Small
    : px < 1024
    ? WindowSize.Medium
    : px < 1280
    ? WindowSize.Large
    : WindowSize.XLarge
}

export function getFromStore<K extends keyof State>(key: K): State[K] {
  return useMappedState(useCallback((s: State) => s[key], []))
}

export function formatDate(date: Date | string | number) {
  return format(date, isToday(date) ? "HH:mm" : "D MMM")
}
