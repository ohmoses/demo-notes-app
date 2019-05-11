import { combineReducers, createStore } from "redux"
import { devToolsEnhancer } from "redux-devtools-extension"

import {
  currentNoteId,
  filter,
  isMutating,
  isNoteExpanded,
  isSidebarExpanded,
  showDrawer,
  showTagModal,
  sortConfig,
  windowSize,
} from "./model"

const rootReducer = combineReducers({
  currentNoteId,
  filter,
  isMutating,
  isNoteExpanded,
  isSidebarExpanded,
  showDrawer,
  showTagModal,
  sortConfig,
  windowSize,
})

export type State = ReturnType<typeof rootReducer>

export const store = createStore(rootReducer, {}, devToolsEnhancer({}))
