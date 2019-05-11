import { FunctionComponent } from "react"
import { useApolloClient, useMutation } from "react-apollo-hooks"
import { useDispatch } from "redux-react-hook"
import uuid from "uuid/v4"

import {
  CreateNoteMutation,
  CreateNoteMutationVariables,
  MainQuery,
} from "../gen/types"
import { setCurrentNoteId, setIsMutating } from "../model"
import { getFromStore } from "../utils"
import { TAG_FIELDS_FRAGMENT } from "./gql/fragments"
import { CREATE_NOTE_MUTATION } from "./gql/mutations"
import { MAIN_QUERY } from "./gql/queries"

export type WithCreateNote<P> = P & { createNote: () => void }

export const withCreateNote = <P>(
  component: FunctionComponent<WithCreateNote<P>>,
) => (props: P) => {
  const dispatch = useDispatch()
  const client = useApolloClient()
  const filter = getFromStore("filter")
  const createNoteMutation = useMutation<
    CreateNoteMutation,
    CreateNoteMutationVariables
  >(CREATE_NOTE_MUTATION)

  const createNote = () => {
    const id = uuid()
    const now = new Date().toISOString()

    dispatch(setIsMutating(true))
    createNoteMutation({
      variables: { id, tagIds: filter.tagId ? [filter.tagId] : [] },
      update: (cache, { data: { createNote: result } }) => {
        const data: MainQuery = cache.readQuery({ query: MAIN_QUERY })

        data.notes.push(result.note)
        result.note.tags.forEach(tag => {
          Object.assign(data.tags.find(t => t.id === tag.id), tag)
        })

        cache.writeQuery({ query: MAIN_QUERY, data })

        if (result.optimistic) {
          dispatch(setCurrentNoteId(result.note.id))
        } else {
          dispatch(setIsMutating(false))
        }
      },
      optimisticResponse: ({ tagIds }: { tagIds: string[] }) => ({
        createNote: {
          __typename: "NotePayload",
          note: {
            __typename: "Note",
            id,
            title: "",
            content: "",
            createdAt: now,
            modifiedAt: now,
            tags: tagIds
              .map(tagId => {
                const tag = client.readFragment({
                  id: tagId,
                  fragment: TAG_FIELDS_FRAGMENT,
                })
                tag.noteCount += 1
                return tag
              })
              .filter(Boolean),
          },
          optimistic: true,
        },
      }),
    })
  }
  return component({ ...props, createNote })
}
