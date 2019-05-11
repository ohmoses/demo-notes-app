import {
  DateTime,
  NonNegativeInt,
  RegularExpression,
} from "@okgrow/graphql-scalars"
import gql from "graphql-tag"

import { mergeResolvers, mergeTypes } from "../../merge-graphql-schemas"
import { nodeResolvers, nodeTypes } from "./Node"
import { noteResolvers, noteTypes } from "./Note"
import { tagResolvers, tagTypes } from "./Tag"

const scalarTypes = gql`
  scalar DateTime
  scalar NonNegativeInt
  scalar TagName
`

const scalarResolvers = {
  DateTime,
  NonNegativeInt,
  TagName: new RegularExpression("TagName", /^.{1,40}$/),
}

export const typeDefs = mergeTypes([
  nodeTypes,
  noteTypes,
  tagTypes,
  scalarTypes,
])

export const resolvers = mergeResolvers([
  nodeResolvers,
  noteResolvers,
  tagResolvers,
  scalarResolvers,
])
