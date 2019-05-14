import { useMutation } from "react-apollo-hooks"
import { useDispatch } from "redux-react-hook"
import uuid from "uuid/v4"

import {
  CreateTagMutation,
  CreateTagMutationVariables,
  TagsQuery,
} from "../gen/types"
import { setIsMutating } from "../model"
import { CREATE_TAG_MUTATION } from "./gql/mutations"
import { TAGS_QUERY } from "./gql/queries"

export const useCreateTag = () => {
  const dispatch = useDispatch()
  const createTagMutation = useMutation<
    CreateTagMutation,
    CreateTagMutationVariables
  >(CREATE_TAG_MUTATION)

  const createTag = (name: string) => {
    const tag = {
      __typename: "Tag",
      id: uuid(),
      name,
      noteCount: 0,
    }

    dispatch(setIsMutating(true))
    createTagMutation({
      variables: tag,
      update: (cache, { data: { createTag: result } }) => {
        const data: TagsQuery = cache.readQuery({
          query: TAGS_QUERY,
        })

        data.tags.push(result.tag)

        cache.writeQuery({
          query: TAGS_QUERY,
          data,
        })

        if (!result.optimistic) {
          dispatch(setIsMutating(false))
        }
      },
      optimisticResponse: {
        createTag: {
          __typename: "TagPayload",
          optimistic: true,
          tag,
        },
      },
    })
    return tag
  }
  return createTag
}
