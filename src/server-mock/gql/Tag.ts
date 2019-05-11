import gql from "graphql-tag"
import uuid from "uuid/v4"

import {
  MutationResolvers,
  QueryResolvers,
  TagResolvers,
} from "../../gen/types"
import { DBType, INoteDb, ITagDb } from "../db"

export const tagTypes = gql`
  type Tag implements Node {
    id: ID!
    name: String!
    noteCount: NonNegativeInt!
  }

  type Query {
    tags: [Tag!]!
  }

  type Mutation {
    createTag(input: CreateTagInput!): TagPayload!
    updateTag(id: ID!, input: UpdateTagInput!): TagPayload!
    deleteTag(id: ID!): TagPayload!
  }

  input CreateTagInput {
    id: ID
    name: String!
  }

  input UpdateTagInput {
    name: String
  }

  type TagPayload {
    tag: Tag!
    notes: [Note!]
    optimistic: Boolean!
  }
`

const Tag: TagResolvers = {
  name: ({ id, name }, _, { db }) => name || db.get<ITagDb>(id).name,

  noteCount: ({ id, noteIds }, _, { db }) =>
    (noteIds || db.get<ITagDb>(id).noteIds).length,
}

const Query: QueryResolvers = {
  tags: (_, __, { db }) => db.my.tagIds.map(db.get) as ITagDb[],
}

const Mutation: MutationResolvers = {
  createTag: (_, { input: { id: inputId, name } }, { db }) => {
    const id = inputId || uuid()
    db.my.tagIds.push(id)
    return {
      optimistic: false,
      tag: db.put({
        id,
        type: DBType.Tag,
        name,
        noteIds: [],
      }),
    }
  },

  updateTag: (_, { id, input: { name } }, { db }) => ({
    optimistic: false,
    tag: db.upsert<ITagDb>(id, DBType.Tag, tag => {
      tag.name = name || tag.name
      return tag
    }),
  }),

  deleteTag: (_, { id }, { db }) => {
    const tag = db.get<ITagDb>(id, DBType.Tag)
    const notes = tag.noteIds.map(noteId =>
      db.upsert<INoteDb>(noteId, note => {
        note.tagIds = note.tagIds.filter(tagId => tagId !== id)
        return note
      }),
    )
    db.my.tagIds = db.my.tagIds.filter(tagId => tagId !== id)
    db.remove(id)
    // TODO: This will throw if any tag field resolver tries to read the db
    return {
      optimistic: false,
      notes,
      tag,
    }
  },
}

export const tagResolvers = {
  Tag,
  Query,
  Mutation,
}
