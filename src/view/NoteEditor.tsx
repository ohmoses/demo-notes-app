import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import { useMutation } from "react-apollo-hooks"
import Textarea from "react-textarea-autosize"
import { useDispatch } from "redux-react-hook"

import {
  DeleteNoteMutation,
  DeleteNoteMutationVariables,
  MainQuery,
  Note,
  NotesQuery,
  UpdateNoteMutation,
  UpdateNoteMutationVariables,
} from "../gen/types"
import { setCurrentNoteId, setExpandNote, setIsMutating } from "../model"
import {
  debounceWithOnStart,
  formatDate,
  getFromStore,
  Maybe,
  WindowSize,
} from "../utils"
import { DELETE_NOTE_MUTATION, UPDATE_NOTE_MUTATION } from "./gql/mutations"
import { MAIN_QUERY, NOTES_QUERY } from "./gql/queries"
import { Icon } from "./Icon"
import styl from "./NoteEditor.scss"
import { TagList } from "./TagList"

interface Props {
  noteCount: number
  currentNote: Maybe<Note>
}

export function NoteEditor({ noteCount, currentNote }: Props) {
  // TODO: Find out why this (conditionally called hooks) works
  if (!currentNote) {
    return (
      <div className={styl.emptyMessage}>
        {noteCount ? <div>Select a note</div> : null}
      </div>
    )
  }

  const dispatch = useDispatch()
  const [title, setTitle] = useState(currentNote.title)
  const [content, setContent] = useState(currentNote.content)

  // https://reactjs.org/docs/hooks-faq.html#how-do-i-implement-getderivedstatefromprops
  const [prevId, setPrevId] = useState(null)
  if (currentNote.id !== prevId) {
    setTitle(currentNote.title)
    setContent(currentNote.content)
    setPrevId(currentNote.id)
  }

  // Mutations
  const updateNoteMutation = useMutation<
    UpdateNoteMutation,
    UpdateNoteMutationVariables
  >(UPDATE_NOTE_MUTATION)

  // NB: Note *has* to be passed in, because the debounce is memoized
  const updateNote = (note: Note) => {
    updateNoteMutation({
      variables: note,
      update: (cache, { data: { updateNote: result } }) => {
        const data: NotesQuery = cache.readQuery({
          query: NOTES_QUERY,
        })

        Object.assign(data.notes.find(n => n.id === result.note.id), result)

        cache.writeQuery({
          query: NOTES_QUERY,
          data,
        })

        if (!result.optimistic) {
          dispatch(setIsMutating(false))
        }
      },
      optimisticResponse: {
        updateNote: {
          __typename: "NotePayload",
          note: {
            ...note,
            modifiedAt: new Date().toISOString(),
          },
          optimistic: true,
        },
      },
    })
  }
  const debouncedUpdate = useCallback(
    debounceWithOnStart(_ => dispatch(setIsMutating(true)), updateNote, 500),
    // ^^^ Underscore instead of empty parens for (TypeScript) reasons; not worth thinking about
    [currentNote.id],
  )

  const deleteNoteMutation = useMutation<
    DeleteNoteMutation,
    DeleteNoteMutationVariables
  >(DELETE_NOTE_MUTATION)

  const deleteNote = () => {
    dispatch(setIsMutating(true))
    deleteNoteMutation({
      variables: { id: currentNote.id },
      update: (cache, { data: { deleteNote: result } }) => {
        const data: MainQuery = cache.readQuery({
          query: MAIN_QUERY,
        })

        result.tags.forEach(tag => {
          Object.assign(data.tags.find(({ id }) => id === tag.id), tag)
        })
        data.notes = data.notes.filter(n => n.id !== result.id)

        cache.writeQuery({
          query: MAIN_QUERY,
          data,
        })

        if (result.optimistic) {
          dispatch(setCurrentNoteId(null))
        } else {
          dispatch(setIsMutating(false))
        }
      },
      optimisticResponse: {
        deleteNote: {
          __typename: "NotePayload",
          id: currentNote.id,
          tags: currentNote.tags.map(t => ({
            ...t,
            noteCount: t.noteCount - 1,
          })),
          optimistic: true,
        },
      },
    })
  }

  // Input handlers
  const handleTitleInput = ({
    currentTarget: { value },
  }: ChangeEvent<HTMLTextAreaElement>) => {
    debouncedUpdate({ ...currentNote, title: value, content })
    setTitle(value)
  }
  const handleContentInput = ({
    currentTarget: { value },
  }: ChangeEvent<HTMLTextAreaElement>) => {
    debouncedUpdate({ ...currentNote, title, content: value })
    setContent(value)
  }

  // Logic for displaying header icons
  const isNoteExpanded = getFromStore("isNoteExpanded")
  const isMutating = getFromStore("isMutating")
  const windowSize = getFromStore("windowSize")
  const showArrowBack = windowSize === WindowSize.Small

  // Focus management
  const titleRef = useRef(null)
  const contentRef = useRef(null)
  useEffect(() => {
    if (currentNote.id) {
      if (!title && !content && titleRef.current) {
        titleRef.current.focus()
      } else if (contentRef.current) {
        contentRef.current.focus()
      }
    }
  }, [currentNote.id])

  return (
    <div className={styl.container}>
      {/* Header */}
      <div className={styl.header}>
        {showArrowBack ? (
          <Icon
            onClick={() => dispatch(setCurrentNoteId(null))}
            name="arrow_back"
          />
        ) : isNoteExpanded ? (
          <Icon
            onClick={() => dispatch(setExpandNote(false))}
            name="fullscreen_exit"
          />
        ) : (
          <Icon
            onClick={() => dispatch(setExpandNote(true))}
            name="fullscreen"
          />
        )}
        <div className={styl.filler} />
        {isMutating ? <Icon name="more_horiz" /> : <Icon name="check" />}
        <Icon onClick={deleteNote} name="delete" />
      </div>

      {/* Title */}
      <div className={styl.titleContainer}>
        <Textarea
          className={styl.titleInput}
          inputRef={titleRef}
          value={title}
          placeholder="Untitled"
          onInput={handleTitleInput}
        />
      </div>

      {/* Dates */}
      <div className={styl.datesContainer}>
        <span className={styl.dateDesc}>Created</span>{" "}
        {formatDate(currentNote.createdAt)},{" "}
        <span className={styl.dateDesc}>Last modified</span>{" "}
        {formatDate(currentNote.modifiedAt)}
      </div>

      {/* Tags */}
      <div className={styl.tagListContainer}>
        <TagList note={currentNote} />
      </div>

      {/* Content */}
      <div className={styl.contentContainer}>
        <textarea
          className={styl.contentInput}
          ref={contentRef}
          value={content}
          placeholder="What's on your mind?"
          onInput={handleContentInput}
        />
      </div>
    </div>
  )
}
