import gql from "graphql-tag"

import { NodeResolvers, QueryResolvers } from "../../gen/types"
import { INode } from "../db"

export const nodeTypes = gql`
  interface Node {
    id: ID!
  }

  type Query {
    node(id: ID!): Node!
    nodes(ids: [ID!]!): [Node!]!
    # search(term: String!): [Node!]!
  }
`

const Node: NodeResolvers = {
  __resolveType: ({ type }: INode) => type,
}

const Query: QueryResolvers = {
  node: (_, { id }, { db }) => db.get(id),
  nodes: (_, { ids }, { db }) => ids.map(db.get),
}

export const nodeResolvers = {
  Node,
  Query,
}
