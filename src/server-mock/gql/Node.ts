import gql from "graphql-tag"

import { NodeResolvers } from "../../gen/types"
import { INode } from "../db"

export const nodeTypes = gql`
  interface Node {
    id: ID!
  }
`

const Node: NodeResolvers = {
  __resolveType: ({ type }: INode) => type,
}

export const nodeResolvers = {
  Node,
}
