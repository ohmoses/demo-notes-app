import gql from "graphql-tag"
import { createElement } from "react"
import { useQuery } from "react-apollo-hooks"

import { NotesQuery } from "../gen/types"

const NOTES_QUERY = gql`
  query Notes {
    allNotes {
      content
    }
  }
`

export function App() {
  const {
    data: { allNotes },
  } = useQuery<NotesQuery>(NOTES_QUERY)

  return (
    <div>
      Notes: "{allNotes && allNotes.map(note => note.content).join(", ")}"
    </div>
  )
}
