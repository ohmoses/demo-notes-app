declare module "*/merge_types.js" {
  import { DocumentNode, Source } from "graphql"
  export default function mergeTypes(
    types: Array<string | Source | DocumentNode>,
    options?: { all: boolean },
  ): string
}

declare module "*/merge_resolvers.js" {
  export default function mergeResolvers<T>(args: T[]): T
}
