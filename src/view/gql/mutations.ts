import gql from "graphql-tag"

import { NOTE_FIELDS_FRAGMENT, TAG_FIELDS_FRAGMENT } from "./fragments"

export const CREATE_NOTE_MUTATION = gql`
  mutation CreateNote($id: ID, $tagIds: [ID!]) {
    createNote(input: { id: $id, tagIds: $tagIds }) {
      note {
        ...noteFields
      }
      optimistic
    }
  }
  ${NOTE_FIELDS_FRAGMENT}
`

export const UPDATE_NOTE_MUTATION = gql`
  mutation UpdateNote($id: ID!, $title: String, $content: String) {
    updateNote(id: $id, input: { title: $title, content: $content }) {
      note {
        ...noteFields
      }
      optimistic
    }
  }
  ${NOTE_FIELDS_FRAGMENT}
`

export const ADD_TAG_MUTATION = gql`
  mutation AddTag($noteId: ID!, $tagId: ID!) {
    addTag(noteId: $noteId, tagId: $tagId) {
      note {
        ...noteFields
      }
      tag {
        ...tagFields
      }
      optimistic
    }
  }
  ${NOTE_FIELDS_FRAGMENT}
  ${TAG_FIELDS_FRAGMENT}
`

export const REMOVE_TAG_MUTATION = gql`
  mutation RemoveTag($noteId: ID!, $tagId: ID!) {
    removeTag(noteId: $noteId, tagId: $tagId) {
      note {
        ...noteFields
      }
      tag {
        ...tagFields
      }
      optimistic
    }
  }
  ${NOTE_FIELDS_FRAGMENT}
  ${TAG_FIELDS_FRAGMENT}
`

export const DELETE_NOTE_MUTATION = gql`
  mutation DeleteNote($id: ID!) {
    deleteNote(id: $id) {
      id
      tags {
        ...tagFields
      }
      optimistic
    }
  }
  ${TAG_FIELDS_FRAGMENT}
`

export const CREATE_TAG_MUTATION = gql`
  mutation CreateTag($id: ID, $name: String!) {
    createTag(input: { id: $id, name: $name }) {
      tag {
        ...tagFields
      }
      optimistic
    }
  }
  ${TAG_FIELDS_FRAGMENT}
`

export const UPDATE_TAG_MUTATION = gql`
  mutation UpdateTag($id: ID!, $name: String!) {
    updateTag(id: $id, input: { name: $name }) {
      tag {
        ...tagFields
      }
      optimistic
    }
  }
  ${TAG_FIELDS_FRAGMENT}
`

export const DELETE_TAG_MUTATION = gql`
  mutation DeleteTag($id: ID!) {
    deleteTag(id: $id) {
      tag {
        ...tagFields
      }
      optimistic
    }
  }
  ${TAG_FIELDS_FRAGMENT}
`
