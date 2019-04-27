import gql from "graphql-tag"
import uuid from "uuid/v4"

import {
  MutationResolvers,
  NoteResolvers,
  QueryResolvers,
} from "../../gen/types"
import { DBType, INoteDb, ITagDb } from "../db"
import { paginate, sort } from "../utils"

export const noteTypes = gql`
  enum NoteColor {
    WHITE
    YELLOW
    GREEN
    RED
    BLUE
  }

  enum SortBy {
    title
    createdAt
    modifiedAt
  }

  enum SortOrder {
    ASC
    DESC
  }

  type Note implements Node {
    id: ID!
    title: String!
    content: String!
    createdAt: DateTime!
    modifiedAt: DateTime!
    tags: [Tag!]!
    color: NoteColor!
  }

  type Query {
    notes(
      first: NonNegativeInt
      after: String
      sortBy: SortBy = createdAt
      sortOrder: SortOrder = DESC
    ): NotesConnection!
    allNotes(sortBy: SortBy = createdAt, sortOrder: SortOrder = DESC): [Note!]!
  }

  type NotesConnection {
    totalCount: Int!
    pageInfo: PageInfo!
    edges: [NoteEdge!]!
  }

  type NoteEdge {
    cursor: String!
    note: Note!
  }

  type Mutation {
    createNote(input: CreateNoteInput!): Note!
    updateNote(id: ID!, input: UpdateNoteInput!): Note!
    addTag(noteId: ID!, tagId: ID!): Note!
    removeTag(noteId: ID!, tagId: ID!): Note!
    deleteNote(id: ID!): Boolean!
  }

  input CreateNoteInput {
    title: String = ""
    content: String = ""
    tagIds: [ID!] = []
    color: NoteColor = WHITE
  }

  input UpdateNoteInput {
    title: String
    content: String
    color: NoteColor
  }
`

const Note: NoteResolvers = {
  title: ({ id, title }, _, { db }) => title || db.get<INoteDb>(id).title,
  content: ({ id, content }, _, { db }) =>
    content || db.get<INoteDb>(id).content,
  createdAt: ({ id, createdAt }, _, { db }) =>
    createdAt || db.get<INoteDb>(id).createdAt,
  modifiedAt: ({ id, modifiedAt }, _, { db }) =>
    modifiedAt || db.get<INoteDb>(id).modifiedAt,
  tags: ({ id, tagIds }, _, { db }) =>
    (tagIds || db.get<INoteDb>(id).tagIds).map(db.get) as ITagDb[],
}

const Query: QueryResolvers = {
  notes: (_, { after, first, sortBy, sortOrder }, { db }) =>
    paginate(
      sort(db.my.noteIds.map(db.get) as INoteDb[], sortBy, sortOrder),
      first,
      after,
    ),
  allNotes: (_, { sortBy, sortOrder }, { db }) =>
    sort(db.my.noteIds.map(db.get) as INoteDb[], sortBy, sortOrder),
}

const Mutation: MutationResolvers = {
  createNote: (
    _,
    { input: { title = null, content, tagIds = [], color } },
    { db },
  ) => {
    const id = uuid()
    const createdAt = new Date()
    if (tagIds) {
      // Make sure *all* are valid before touching anything
      tagIds.forEach(tagId => {
        db.check(tagId, DBType.Tag)
      })
      tagIds.forEach(tagId => {
        db.upsert<ITagDb>(tagId, tag => {
          tag.noteIds.push(id)
          return tag
        })
      })
    }
    db.my.noteIds.push(id)
    return db.put({
      id: uuid(),
      type: DBType.Note,
      title,
      content,
      createdAt,
      modifiedAt: createdAt,
      tagIds,
      color,
    })
  },
  updateNote: (_, { id, input: { title, content, color } }, { db }) => {
    return db.upsert<INoteDb>(id, DBType.Note, note => {
      note.title = title !== undefined ? title : note.title
      note.content = content !== undefined ? content : note.content
      note.color = color || note.color
      return note
    })
  },
  addTag: (_, { noteId, tagId }, { db }) => {
    db.check(tagId, DBType.Tag)
    return db.upsert<INoteDb>(noteId, DBType.Note, note => {
      note.tagIds.push(tagId)
      return note
    })
  },
  removeTag: (_, { noteId, tagId }, { db }) => {
    return db.upsert<INoteDb>(noteId, DBType.Note, note => {
      note.tagIds = note.tagIds.filter(id => id !== tagId)
      return note
    })
  },
  deleteNote: (_, { id }, { db }) => {
    db.check(id, DBType.Note)
    db.my.noteIds = db.my.noteIds.filter(noteId => noteId !== id)
    return db.remove(id)
  },
}

export const noteResolvers = {
  Note,
  Query,
  Mutation,
}
