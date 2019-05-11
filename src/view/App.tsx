import React from "react"
import { useQuery } from "react-apollo-hooks"
import { useDispatch } from "redux-react-hook"

import { MainQuery, MainQueryVariables } from "../gen/types"
import { setShowDrawer, setShowTagModal } from "../model"
import { getFromStore, WindowSize } from "../utils"
import styl from "./App.scss"
import { MAIN_QUERY } from "./gql/queries"
import { NoteEditor } from "./NoteEditor"
import { NoteList } from "./NoteList"
import { Sidebar } from "./Sidebar"
import { TagEditor } from "./TagEditor"

export function App() {
  const {
    data: { notes, tags },
    loading,
    error,
  } = useQuery<MainQuery, MainQueryVariables>(MAIN_QUERY)

  if (error) {
    return <div className={styl.errorMessageScreen}>{error.message}</div>
  }

  const dispatch = useDispatch()
  const currentNoteId = getFromStore("currentNoteId")
  const isNoteOpen = currentNoteId // For legibility
  const isNoteExpanded = getFromStore("isNoteExpanded")
  const isSidebarExpanded = getFromStore("isSidebarExpanded")
  const showDrawer = getFromStore("showDrawer")
  const showTagModal = getFromStore("showTagModal")
  const windowSize = getFromStore("windowSize")

  const showFixedSidebar =
    windowSize > WindowSize.Large && isSidebarExpanded && !isNoteExpanded
  const showDrawerSidebar = windowSize <= WindowSize.Large && showDrawer
  const showNoteList =
    (windowSize > WindowSize.Small && !isNoteExpanded) || !isNoteOpen
  const showNoteEditor = isNoteOpen || windowSize > WindowSize.Small

  return (
    <div className={styl.container}>
      {loading && <div className={styl.loadingDots}>···</div>}
      {showTagModal && (
        <>
          <div
            className={styl.overlay}
            onClick={() => dispatch(setShowTagModal(false))}
          />
          <div className={styl.center}>
            <div className={styl.tagModalContainer}>
              <TagEditor tags={tags} />
            </div>
          </div>
        </>
      )}
      {showDrawerSidebar && (
        <>
          <div
            className={styl.overlay}
            onClick={() => dispatch(setShowDrawer(false))}
          />
          <div className={styl.drawerContainer}>
            <Sidebar tags={tags} />
          </div>
        </>
      )}
      {showFixedSidebar && (
        <div className={styl.sideBarContainer}>
          <Sidebar tags={tags} />
        </div>
      )}
      <div className={styl.mainContainer}>
        {showNoteList && (
          <div className={styl.noteListContainer}>
            <NoteList notes={notes} tags={tags} />
          </div>
        )}
        {showNoteEditor && (
          <div className={styl.noteEditorContainer}>
            <NoteEditor
              noteCount={(notes && notes.length) || 0}
              currentNote={
                (notes && notes.find(n => n.id === currentNoteId)) || null
              }
            />
          </div>
        )}
      </div>
    </div>
  )
}
