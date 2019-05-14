import React, { useState } from "react"
import { useDispatch } from "redux-react-hook"

import { MainQuery } from "../gen/types"
import { setFilter, setShowDrawer, setSortConfig } from "../model"
import {
  getFromStore,
  Maybe,
  sort,
  SortBy,
  SortOrder,
  WindowSize,
} from "../utils"
import { Icon } from "./Icon"
import styl from "./NoteList.scss"
import { NoteListItem } from "./NoteListItem"
import { useCreateNote } from "./useCreateNote"

interface Props {
  notes: MainQuery["notes"]
  tags: MainQuery["tags"]
}

const sorts = [
  {
    desc: "Alphabetically",
    sortBy: SortBy.Title,
    sortOrder: SortOrder.Asc,
  },
  {
    desc: "Newest",
    sortBy: SortBy.CreatedAt,
    sortOrder: SortOrder.Desc,
  },
  {
    desc: "Recently edited",
    sortBy: SortBy.ModifiedAt,
    sortOrder: SortOrder.Desc,
  },
]

export function NoteList({ notes, tags }: Props) {
  const dispatch = useDispatch()
  const createNote = useCreateNote()
  const sortConfig = getFromStore("sortConfig")
  const windowSize = getFromStore("windowSize")
  const { tagId } = getFromStore("filter")

  const [showSortMenu, setShowSortMenu] = useState(false)

  if (!notes) {
    return <div className={styl.container} />
  }

  const sortedNotes = sort(
    tagId
      ? notes.filter(note => note.tags.some(({ id }) => id === tagId))
      : notes,
    sortConfig.sortBy,
    sortConfig.sortOrder,
  )

  const tagName: Maybe<string> =
    tagId && tags.find(({ id }) => id === tagId).name

  return (
    <div className={styl.container}>
      {/* Header */}
      <div className={styl.header}>
        {windowSize > WindowSize.Large ? null : (
          <Icon onClick={() => dispatch(setShowDrawer(true))} name="menu" />
        )}
        <div className={styl.listTitle}>
          {tagId ? (
            <span className={styl.tagName}>{tagName}</span>
          ) : (
            <span>All notes</span>
          )}
        </div>
        <div className={styl.filler} />

        {/* Sort dropdown */}
        <div
          className={styl.dropdownContainer}
          onClick={() => setShowSortMenu(v => !v)}
        >
          <Icon className={styl.iconClickable} name="sort" />
          {showSortMenu && (
            <>
              <div className={styl.overlay} />
              <div className={styl.dropdown}>
                {sorts.map(row => (
                  <div
                    key={row.desc}
                    className={styl.dropdownRow}
                    onClick={() =>
                      dispatch(
                        setSortConfig({
                          sortBy: row.sortBy,
                          sortOrder: row.sortOrder,
                        }),
                      )
                    }
                  >
                    {row.desc}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Note count */}
      <div className={styl.noteCount}>
        {sortedNotes.length ? (
          <span>
            {sortedNotes.length} note{sortedNotes.length > 1 ? "s" : ""}
          </span>
        ) : (
          <span>
            No notes{" "}
            {tagId ? (
              <>
                under this tag.{" "}
                <span
                  className={styl.clickable}
                  onClick={() => dispatch(setFilter({ tagId: null }))}
                >
                  Show all notes
                </span>
              </>
            ) : (
              <>to show</>
            )}
          </span>
        )}
      </div>

      {/* 'Create note' button */}
      {!sortedNotes.length && !tagId && (
        <button className={styl.button} onClick={createNote}>
          CREATE NOTE
        </button>
      )}

      {/* Note list */}
      <div className={styl.listContainer}>
        {sortedNotes.map(note => (
          <NoteListItem key={note.id} note={note} />
        ))}
      </div>
    </div>
  )
}
