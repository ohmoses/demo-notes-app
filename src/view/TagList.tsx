import React, { ChangeEvent, KeyboardEvent, useState } from "react"
import { useMutation, useQuery } from "react-apollo-hooks"
import { useDispatch } from "redux-react-hook"

import {
  AddTagMutation,
  AddTagMutationVariables,
  MainQuery,
  Note,
  RemoveTagMutation,
  RemoveTagMutationVariables,
  Tag,
  TagsQuery,
} from "../gen/types"
import { setIsMutating } from "../model"
import { Maybe } from "../utils"
import { ADD_TAG_MUTATION, REMOVE_TAG_MUTATION } from "./gql/mutations"
import { MAIN_QUERY, TAGS_QUERY } from "./gql/queries"
import styl from "./TagList.scss"
import { useCreateTag } from "./useCreateTag"

interface Props {
  note: Maybe<Note>
}

export function TagList({ note }: Props) {
  const { data } = useQuery<TagsQuery>(TAGS_QUERY)

  if (!data) {
    return null
  }

  const dispatch = useDispatch()
  const createTag = useCreateTag()
  const [inputVal, setInputVal] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [tagSelected, setTagSelected] = useState(false)

  const suggestions = data.tags.filter(
    ({ name, id }) =>
      name.startsWith(inputVal.trim()) && !note.tags.some(t => t.id === id),
  )
  const isNewTag =
    inputVal.trim() && !data.tags.some(({ name }) => name === inputVal)

  const suggestionsVisible = !!(
    showSuggestions &&
    (inputVal.trim() || suggestions.length)
  )

  const [row, setRow] = useState(0)
  const numRows = suggestions.length + +!!isNewTag
  const prevRow = (row + numRows - 1) % numRows
  const nextRow = (row + 1) % numRows

  if (row >= numRows && row > 0) {
    setRow(numRows - 1)
  }

  const addTagMutation = useMutation<AddTagMutation, AddTagMutationVariables>(
    ADD_TAG_MUTATION,
  )

  const addTag = (tag: Tag) => {
    dispatch(setIsMutating(true))
    addTagMutation({
      variables: { noteId: note.id, tagId: tag.id },
      update: (cache, { data: { addTag: result } }) => {
        const allData: MainQuery = cache.readQuery({
          query: MAIN_QUERY,
        })

        Object.assign(
          allData.notes.find(n => n.id === result.note.id),
          result.note,
        )
        Object.assign(
          allData.tags.find(t => t.id === result.tag.id),
          result.tag,
        )

        cache.writeQuery({
          query: MAIN_QUERY,
          data: allData,
        })

        if (!result.optimistic) {
          dispatch(setIsMutating(false))
        }
      },
      optimisticResponse: () => {
        tag.noteCount += 1
        note.tags.push(tag)
        note.modifiedAt = new Date()
        return {
          addTag: {
            __typename: "ChangeTagsPayload",
            note,
            tag,
            optimistic: true,
          },
        }
      },
    })
  }

  const removeTagMutation = useMutation<
    RemoveTagMutation,
    RemoveTagMutationVariables
  >(REMOVE_TAG_MUTATION)

  const removeTag = (tag: Tag) => {
    dispatch(setIsMutating(true))
    removeTagMutation({
      variables: { noteId: note.id, tagId: tag.id },
      update: (cache, { data: { removeTag: result } }) => {
        const allData: MainQuery = cache.readQuery({
          query: MAIN_QUERY,
        })

        Object.assign(
          allData.notes.find(n => n.id === result.note.id),
          result.note,
        )
        Object.assign(
          allData.tags.find(t => t.id === result.tag.id),
          result.tag,
        )

        cache.writeQuery({
          query: MAIN_QUERY,
          data: allData,
        })

        if (!result.optimistic) {
          dispatch(setIsMutating(false))
        }
      },
      optimisticResponse: () => {
        tag.noteCount -= 1
        note.tags = note.tags.filter(t => t.id !== tag.id)
        note.modifiedAt = new Date()
        return {
          removeTag: {
            __typename: "ChangeTagsPayload",
            note,
            tag,
            optimistic: true,
          },
        }
      },
    })
  }

  const addTagAndClear = (tag: Tag) => {
    addTag(tag)
    setInputVal("")
    setRow(0)
  }

  const createTagAndClear = () => {
    const newTag = createTag(inputVal.trim().replace(/\s+/g, " "))
    addTag(newTag)
    setInputVal("")
    setRow(0)
  }

  const handleTagInput = ({
    currentTarget: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    setTagSelected(false)
    if ((value.trim() || suggestions) && !showSuggestions) {
      setShowSuggestions(true)
    }
    if (value.length < 40) {
      setInputVal(value)
    }
  }

  const handleKeys = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowUp":
        if (suggestionsVisible) {
          e.preventDefault()
          setRow(prevRow)
        }
        return
      case "ArrowDown":
        if (suggestionsVisible) {
          e.preventDefault()
          setRow(nextRow)
        }
        return
      case "Escape":
        if (suggestionsVisible) {
          setShowSuggestions(false)
        }
        return
      case "Enter":
        if (suggestionsVisible) {
          if (row === suggestions.length) {
            createTagAndClear()
          } else {
            addTagAndClear(suggestions[row])
          }
        } else if (inputVal.trim() || suggestions.length) {
          setShowSuggestions(true)
        }
        return
      case "Backspace":
        if (tagSelected) {
          removeTag(note.tags[note.tags.length - 1])
          setTagSelected(false)
          setRow(0)
        } else if (!inputVal.trim() && note.tags.length) {
          setTagSelected(true)
          setShowSuggestions(false)
        }
    }
  }

  const lastRowClass =
    row === suggestions.length ? styl.lastRowSelected : styl.lastRow

  return (
    <div className={styl.container}>
      {/* Tag chips */}
      {note.tags.map((tag, i, tags) => (
        <div
          key={tag.id}
          className={
            tagSelected && i === tags.length - 1 ? styl.selectedChip : styl.chip
          }
        >
          <div className={styl.chipContent}>{tag.name}</div>
          <div
            className={styl.removeButton}
            onClick={() => {
              removeTag(tag)
              setRow(0)
            }}
          >
            <i className="material-icons">close</i>
          </div>
        </div>
      ))}

      {/* Input field */}
      <div className={styl.inputContainer}>
        <input
          className={styl.input}
          value={inputVal}
          placeholder="Add a tag…"
          onInput={handleTagInput}
          onKeyDown={handleKeys}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => {
            setInputVal("")
            setShowSuggestions(false)
            setTagSelected(false)
          }}
        />

        {/* Auto-resizing input hack – a hidden shadow input */}
        <div className={styl.shadowInput}>{inputVal}</div>

        {/* Suggestion box */}
        {suggestionsVisible && (
          <div className={styl.suggestionBox}>
            {/* List of existing tags */}
            {suggestions.map((tag, i) => (
              <div
                key={tag.id}
                className={row === i ? styl.rowSelected : styl.row}
                onMouseDown={() => addTagAndClear(tag)}
                onMouseEnter={() => setRow(i)}
              >
                {tag.name}
              </div>
            ))}

            {/* Create a new tag */}
            {isNewTag && (
              <div
                className={lastRowClass}
                onMouseDown={createTagAndClear}
                onMouseEnter={() => setRow(suggestions.length)}
              >
                Create tag "{inputVal.trim()}"
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
