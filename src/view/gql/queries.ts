import gql from "graphql-tag"

import { NOTE_FIELDS_FRAGMENT, TAG_FIELDS_FRAGMENT } from "./fragments"

export const NOTES_QUERY = gql`
  query Notes {
    notes {
      ...noteFields
    }
  }
  ${NOTE_FIELDS_FRAGMENT}
`

export const TAGS_QUERY = gql`
  query Tags {
    tags {
      ...tagFields
    }
  }
  ${TAG_FIELDS_FRAGMENT}
`

export const MAIN_QUERY = gql`
  query Main {
    notes {
      ...noteFields
    }
    tags {
      ...tagFields
    }
  }
  ${NOTE_FIELDS_FRAGMENT}
  ${TAG_FIELDS_FRAGMENT}
`
