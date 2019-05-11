import gql from "graphql-tag"
import uuid from "uuid/v4"

import {
  MutationResolvers,
  NoteResolvers,
  QueryResolvers,
} from "../../gen/types"
import { DBType, INoteDb, ITagDb } from "../db"

export const noteTypes = gql`
  type Note implements Node {
    id: ID!
    title: String!
    content: String!
    createdAt: DateTime!
    modifiedAt: DateTime!
    tags: [Tag!]!
  }

  type Query {
    notes: [Note!]!
  }

  type Mutation {
    createNote(input: CreateNoteInput = {}): NotePayload!
    updateNote(id: ID!, input: UpdateNoteInput!): NotePayload!
    addTag(noteId: ID!, tagId: ID!): ChangeTagsPayload!
    removeTag(noteId: ID!, tagId: ID!): ChangeTagsPayload!
    deleteNote(id: ID!): DeleteNotePayload!
  }

  input CreateNoteInput {
    id: ID
    title: String = ""
    content: String = ""
    tagIds: [ID!] = []
  }

  input UpdateNoteInput {
    title: String
    content: String
  }

  type NotePayload {
    note: Note!
    optimistic: Boolean!
  }

  type DeleteNotePayload {
    id: ID!
    tags: [Tag!]!
    optimistic: Boolean!
  }

  type ChangeTagsPayload {
    note: Note!
    tag: Tag!
    optimistic: Boolean!
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
  notes: (_, __, { db }) => db.my.noteIds.map(db.get) as INoteDb[],
}

const Mutation: MutationResolvers = {
  createNote: (
    _,
    { input: { id: inputId, title, content, tagIds } },
    { db },
  ) => {
    const id = inputId || uuid()
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
    return {
      note: db.put({
        id,
        type: DBType.Note,
        title,
        content,
        createdAt,
        modifiedAt: createdAt,
        tagIds,
      }),
      optimistic: false,
    }
  },

  updateNote: (_, { id, input: { title, content } }, { db }) => {
    return {
      note: db.upsert<INoteDb>(id, DBType.Note, note => {
        note.title = title !== undefined ? title : note.title
        note.content = content !== undefined ? content : note.content
        note.modifiedAt = new Date()
        return note
      }),
      optimistic: false,
    }
  },

  addTag: (_, { noteId, tagId }, { db }) => ({
    tag: db.upsert<ITagDb>(tagId, DBType.Tag, tag => {
      tag.noteIds.push(noteId)
      return tag
    }),
    note: db.upsert<INoteDb>(noteId, DBType.Note, note => {
      note.tagIds.push(tagId)
      note.modifiedAt = new Date()
      return note
    }),
    optimistic: false,
  }),

  removeTag: (_, { noteId, tagId }, { db }) => ({
    tag: db.upsert<ITagDb>(tagId, DBType.Tag, tag => {
      tag.noteIds = tag.noteIds.filter(id => id !== noteId)
      return tag
    }),
    note: db.upsert<INoteDb>(noteId, DBType.Note, note => {
      note.tagIds = note.tagIds.filter(id => id !== tagId)
      note.modifiedAt = new Date()
      return note
    }),
    optimistic: false,
  }),

  deleteNote: (_, { id }, { db }) => {
    const note = db.get<INoteDb>(id, DBType.Note)
    note.tagIds.forEach(tagId => {
      db.upsert<ITagDb>(tagId, tag => {
        tag.noteIds = tag.noteIds.filter(noteId => noteId !== id)
        return tag
      })
    })
    db.my.noteIds = db.my.noteIds.filter(noteId => noteId !== id)
    db.remove(id)
    return {
      id,
      tags: note.tagIds.map(tagId => ({ id: tagId })),
      optimistic: false,
    }
  },
}

export const noteResolvers = {
  Note,
  Query,
  Mutation,
}
