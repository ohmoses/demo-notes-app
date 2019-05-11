import React from "react"
import { useDispatch } from "redux-react-hook"

import { Tag } from "../gen/types"
import { setFilter, setShowDrawer, setShowTagModal } from "../model"
import { ID, sort, SortOrder } from "../utils"
import { Icon } from "./Icon"
import styl from "./Sidebar.scss"
import { withCreateNote, WithCreateNote } from "./withCreateNote"

interface Props {
  tags: Tag[]
}

export const Sidebar = withCreateNote(
  ({ tags, createNote }: WithCreateNote<Props>) => {
    const dispatch = useDispatch()
    const sortedTags = sort(tags || [], "name", SortOrder.Asc)

    const filterByTag = (id: ID) => () => {
      dispatch(setFilter({ tagId: id }))
      dispatch(setShowDrawer(false))
    }

    return (
      <div className={styl.container}>
        {/* 'Create note' button */}
        <div
          className={styl.clickableRow}
          onClick={() => {
            createNote()
            dispatch(setShowDrawer(false))
          }}
        >
          <Icon className={styl.sidebarIcon} name="add_circle_outline" />
          <span>Create note</span>
        </div>

        {/* All notes */}
        <div
          className={styl.clickableRow}
          onClick={() => {
            dispatch(setFilter({ tagId: null }))
            dispatch(setShowDrawer(false))
          }}
        >
          ALL NOTES
        </div>

        {/* Tag header */}
        <div className={styl.row}>
          <div>TAGS</div>
          <div className={styl.filler} />
          <button
            className={styl.editButton}
            onClick={() => {
              dispatch(setShowTagModal(true))
              dispatch(setShowDrawer(false))
            }}
          >
            <Icon className={styl.sidebarIcon} name="edit" />
            <span>Edit</span>
          </button>
        </div>

        {/* Tag list */}
        <div>
          {sortedTags.length ? (
            sortedTags.map(tag => (
              <div
                className={tag.noteCount ? styl.tagRow : styl.tagRowZero}
                key={tag.id}
                onClick={filterByTag(tag.id)}
              >
                <div className={styl.tagName}>{tag.name}</div>
                <div className={styl.noteCount}>{tag.noteCount}</div>
              </div>
            ))
          ) : (
            <div className={styl.empty}>no tags</div>
          )}
        </div>
      </div>
    )
  },
)
