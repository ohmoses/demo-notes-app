import React, { useEffect, useRef, useState } from "react"
import { useMutation } from "react-apollo-hooks"
import { useDispatch } from "redux-react-hook"

import {
  DeleteTagMutation,
  DeleteTagMutationVariables,
  MainQuery,
  Tag,
  TagsQuery,
  UpdateTagMutation,
  UpdateTagMutationVariables,
} from "../gen/types"
import { setFilter, setIsMutating, setShowTagModal } from "../model"
import { getFromStore, Maybe, sort, SortOrder } from "../utils"
import { DELETE_TAG_MUTATION, UPDATE_TAG_MUTATION } from "./gql/mutations"
import { MAIN_QUERY, TAGS_QUERY } from "./gql/queries"
import { Icon } from "./Icon"
import styl from "./TagEditor.scss"
import { useCreateTag } from "./useCreateTag"

interface Props {
  tags: MainQuery["tags"]
}

export function TagEditor({ tags }: Props) {
  const dispatch = useDispatch()
  const createTag = useCreateTag()
  const filter = getFromStore("filter")

  const [newTagInputVal, setNewTagInputVal] = useState("")
  const [editInputVal, setEditInputVal] = useState("")
  const [editedTag, setEditedTag] = useState<Maybe<Tag>>(null)

  const sortedTags = sort(tags || [], "name", SortOrder.Asc)

  // Mutations
  const createTagAndClear = () => {
    const name = newTagInputVal.trim().replace(/\s+/g, " ")
    if (!name || name.length > 40) {
      return
    }
    createTag(name)
    setNewTagInputVal("")
  }

  const deleteTagMutation = useMutation<
    DeleteTagMutation,
    DeleteTagMutationVariables
  >(DELETE_TAG_MUTATION)

  const deleteTag = (tag: Tag) => () => {
    if (tag.id === filter.tagId) {
      dispatch(setFilter({ tagId: null }))
    }
    dispatch(setIsMutating(true))
    deleteTagMutation({
      variables: { id: tag.id },
      update: (cache, { data: { deleteTag: result } }) => {
        const data: MainQuery = cache.readQuery({
          query: MAIN_QUERY,
        })

        data.tags = data.tags.filter(t => t.id !== result.tag.id)
        data.notes.forEach(n => {
          n.tags = n.tags.filter(t => t.id !== result.tag.id)
        })

        cache.writeQuery({
          query: MAIN_QUERY,
          data,
        })

        if (!result.optimistic) {
          dispatch(setIsMutating(false))
        }
      },
      optimisticResponse: {
        deleteTag: {
          __typename: "TagPayload",
          tag,
          optimistic: true,
        },
      },
    })
  }

  const editTag = (tag: Tag) => () => {
    setEditInputVal(tag.name)
    setEditedTag(tag)
  }

  const updateTagMutation = useMutation<
    UpdateTagMutation,
    UpdateTagMutationVariables
  >(UPDATE_TAG_MUTATION)

  const confirmEdit = () => {
    const name = editInputVal.trim().replace(/\s+/g, " ")
    if (!name || name.length > 40) {
      return
    }

    dispatch(setIsMutating(true))
    updateTagMutation({
      variables: { id: editedTag.id, name },
      update: (cache, { data: { updateTag: result } }) => {
        const data: TagsQuery = cache.readQuery({
          query: TAGS_QUERY,
        })

        Object.assign(data.tags.find(t => t.id === result.tag.id), result)

        cache.writeQuery({
          query: TAGS_QUERY,
          data,
        })

        if (!result.optimistic) {
          dispatch(setIsMutating(false))
        }
      },
      optimisticResponse: {
        updateTag: {
          __typename: "TagPayload",
          tag: { ...editedTag, name },
          optimistic: true,
        },
      },
    })
    setEditInputVal("")
    setEditedTag(null)
  }

  // Focus management
  const addTagRef = useRef(null)
  const editRef = useRef(null)

  useEffect(() => {
    if (addTagRef.current) {
      addTagRef.current.focus()
    }
  }, [])

  useEffect(() => {
    if (editRef.current) {
      editRef.current.focus()
    }
  }, [editedTag])

  return (
    <div className={styl.container}>
      {/* 'Create tag' input */}
      <div className={styl.row}>
        <input
          className={styl.input}
          value={newTagInputVal}
          onInput={({ currentTarget: { value } }) => {
            if (value.length < 40) {
              setNewTagInputVal(value)
            }
          }}
          placeholder="Create a new tag"
          ref={addTagRef}
        />
        <Icon
          className={styl.iconSmall}
          onClick={createTagAndClear}
          name="add"
        />
      </div>

      {/* Existing tags */}
      {sortedTags.map(tag => (
        <div key={tag.id} className={styl.row}>
          <Icon
            className={styl.iconSmall}
            onClick={deleteTag(tag)}
            name="delete"
          />
          {editedTag && editedTag.id === tag.id ? (
            <div className={styl.inputContainer}>
              <input
                className={styl.input}
                value={editInputVal}
                onInput={({ currentTarget: { value } }) => {
                  if (value.length < 40) {
                    setEditInputVal(value)
                  }
                }}
                ref={editRef}
              />
              {/* Auto-resizing input hack */}
              <div className={styl.shadowInput}>{tag.name}</div>
            </div>
          ) : (
            <>
              <div className={styl.tagName}>{tag.name}</div>
              <div className={styl.filler} />
            </>
          )}
          {editedTag && editedTag.id === tag.id ? (
            <Icon
              className={styl.iconSmall}
              onClick={confirmEdit}
              name="check"
            />
          ) : (
            <Icon
              className={styl.iconSmall}
              onClick={editTag(tag)}
              name="edit"
            />
          )}
        </div>
      ))}

      <button
        className={styl.doneButton}
        onClick={() => dispatch(setShowTagModal(false))}
      >
        DONE
      </button>
    </div>
  )
}
