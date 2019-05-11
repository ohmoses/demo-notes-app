import {
  Action,
  ActionFunction1,
  createAction,
  handleAction,
  Reducer,
} from "redux-actions"

import { ID, Maybe, SortBy, SortOrder, WindowSize } from "./utils"

const replaceState = <T>(_: any, { payload }: Action<T>) => payload
const mergeState = <T extends object>(state: T, { payload }: Action<T>) =>
  state ? { ...state, ...payload } : payload

type A1<T> = ActionFunction1<T, Action<T>>

function reduce<T>(actionType: A1<T>, reducer: Reducer<T, T>, initialState: T) {
  return handleAction<T, T>(actionType, reducer, initialState)
}

// ACTIONS & REDUCERS

// The ID of the note which is open in the editor
// prettier-ignore
export const setCurrentNoteId: A1<Maybe<ID>> = createAction("SET_CURRENT_NOTE_ID")
export const currentNoteId = reduce(setCurrentNoteId, replaceState, null)

// Sorting for the note list
interface SortConfig {
  sortBy: SortBy
  sortOrder: SortOrder
}
const initialSort = { sortBy: SortBy.CreatedAt, sortOrder: SortOrder.Desc }
export const setSortConfig: A1<SortConfig> = createAction("SET_SORT_CONFIG")
export const sortConfig = reduce(setSortConfig, replaceState, initialSort)

// Filters for the note list
interface Filter {
  tagId: Maybe<string>
}
export const setFilter: A1<Filter> = createAction("SET_FILTER")
export const filter = reduce(setFilter, mergeState, { tagId: null })

// Are we waiting for a GraphQL mutation to return?
export const setIsMutating: A1<boolean> = createAction("SET_IS_MUTATING")
export const isMutating = handleAction<number, boolean>(
  setIsMutating,
  (state, { payload }) => (payload ? state + 1 : Math.max(state - 1, 0)),
  0,
)

// Has the note editor been manually expanded to full screen
export const setExpandNote: A1<boolean> = createAction("SET_EXPAND_NOTE")
export const isNoteExpanded = reduce(setExpandNote, replaceState, false)

// Has the sidebar been manually expanded
export const setExpandSidebar: A1<boolean> = createAction("SET_EXPAND_SIDEBAR")
export const isSidebarExpanded = reduce(setExpandSidebar, replaceState, true)

// Display sidebar drawer (on smaller screens)
export const setShowDrawer: A1<boolean> = createAction("SET_SHOW_DRAWER")
export const showDrawer = reduce(setShowDrawer, replaceState, false)

// Display modal for editing tags
export const setShowTagModal: A1<boolean> = createAction("SET_SHOW_TAG_MODAL")
export const showTagModal = reduce(setShowTagModal, replaceState, false)

// Window size
export const setWindowSize: A1<WindowSize> = createAction("SET_WINDOW_SIZE")
export const windowSize = reduce(setWindowSize, replaceState, WindowSize.XLarge)
