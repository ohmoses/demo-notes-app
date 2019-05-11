import { ApolloLink } from "apollo-link"
import { SchemaLink } from "apollo-link-schema"
import { makeExecutableSchema } from "graphql-tools"

import { db } from "./db"
import { resolvers, typeDefs } from "./gql"
import { SimulatedLatencyLink } from "./latency"

const schema = makeExecutableSchema({
  resolvers,
  typeDefs,
})

const context = { db }

export type Context = typeof context

export const mockLink = ApolloLink.from([
  new SimulatedLatencyLink(300),
  new SchemaLink({ schema, context }),
])
