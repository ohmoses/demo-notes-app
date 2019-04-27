import gql from "graphql-tag"
import uuid from "uuid/v4"

import {
  MutationResolvers,
  QueryResolvers,
  SortOrder,
  TagResolvers,
} from "../../gen/types"
import { DBType, INoteDb, ITagDb } from "../db"
import { paginate, sort } from "../utils"

export const tagTypes = gql`
  type Tag implements Node {
    id: ID!
    name: String!
    notes(
      first: NonNegativeInt
      after: String
      sortBy: SortBy = createdAt
      sortOrder: SortOrder = DESC
    ): NotesConnection!
    allNotes(sortBy: SortBy = createdAt, sortOrder: SortOrder = DESC): [Note!]!
  }

  type Query {
    tags: [Tag!]!
  }

  type Mutation {
    createTag(input: CreateTagInput!): Tag!
    updateTag(id: ID!, input: UpdateTagInput!): Tag!
    deleteTag(id: ID!): Boolean!
  }

  input CreateTagInput {
    name: String!
  }

  input UpdateTagInput {
    name: String
  }
`

const Tag: TagResolvers = {
  name: ({ id, name }, _, { db }) => name || db.get<ITagDb>(id).name,
  notes: ({ id, noteIds }, { after, first, sortBy, sortOrder }, { db }) =>
    paginate(
      sort(
        (noteIds || db.get<ITagDb>(id).noteIds).map(db.get) as INoteDb[],
        sortBy,
        sortOrder,
      ),
      first,
      after,
    ),
  allNotes: ({ id, noteIds }, { sortBy, sortOrder }, { db }) =>
    sort(
      (noteIds || db.get<ITagDb>(id).noteIds).map(db.get) as INoteDb[],
      sortBy,
      sortOrder,
    ),
}

const Query: QueryResolvers = {
  tags: (_, __, { db }) =>
    sort(db.my.tagIds.map(db.get) as ITagDb[], "name", SortOrder.Asc),
}

const Mutation: MutationResolvers = {
  createTag: (_, { input: { name } }, { db }) => {
    const id = uuid()
    db.my.tagIds.push(id)
    return db.put({
      id,
      type: DBType.Tag,
      name,
      noteIds: [],
    })
  },
  updateTag: (_, { id, input: { name } }, { db }) =>
    db.upsert<ITagDb>(id, DBType.Tag, tag => {
      tag.name = name || tag.name
      return tag
    }),
  deleteTag: (_, { id }, { db }) => {
    db.check(id, DBType.Tag)
    db.my.tagIds = db.my.tagIds.filter(tagId => tagId !== id)
    return db.remove(id)
  },
}

export const tagResolvers = {
  Tag,
  Query,
  Mutation,
}
