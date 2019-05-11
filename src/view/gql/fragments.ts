import gql from "graphql-tag"

export const NOTE_FIELDS_FRAGMENT = gql`
  fragment noteFields on Note {
    id
    title
    content
    createdAt
    modifiedAt
    tags {
      id
      name
      noteCount
    }
  }
`
export const TAG_FIELDS_FRAGMENT = gql`
  fragment tagFields on Tag {
    id
    name
    noteCount
  }
`
