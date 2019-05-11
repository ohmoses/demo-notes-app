import React from "react"
import { useDispatch } from "redux-react-hook"

import { Note } from "../gen/types"
import { setCurrentNoteId } from "../model"
import { formatDate } from "../utils"
import styl from "./NoteListItem.scss"

interface Props {
  note: Note
}

export function NoteListItem({ note }: Props) {
  const dispatch = useDispatch()
  const selectThisNote = () => dispatch(setCurrentNoteId(note.id))
  return (
    <div className={styl.container} onClick={selectThisNote}>
      <div className={styl.header}>
        {note.title ? (
          <div className={styl.title}>{note.title}</div>
        ) : (
          <div className={styl.placeholder}>Untitled</div>
        )}
        <div className={styl.date}>{formatDate(note.createdAt)}</div>
      </div>
      <div className={styl.preview}>
        <span>{note.content}</span>
      </div>
      {!!note.tags.length && (
        <div className={styl.tagList}>
          {note.tags.map(tag => (
            <div key={tag.id} className={styl.tag}>
              {tag.name}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
