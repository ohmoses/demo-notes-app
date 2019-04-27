import { SchemaLink } from "apollo-link-schema"
import { makeExecutableSchema } from "graphql-tools"

import { db } from "./db"
import { resolvers, typeDefs } from "./gql"

const schema = makeExecutableSchema({
  resolvers,
  typeDefs,
})

const context = { db }

export type Context = typeof context

export const mockLink = new SchemaLink({ schema, context })
