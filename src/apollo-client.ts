import { InMemoryCache } from "apollo-cache-inmemory"
import { ApolloClient } from "apollo-client"

import { mockLink } from "./server-mock"

export const client = new ApolloClient({
  cache: new InMemoryCache({
    dataIdFromObject: o => o.id,
  }),
  link: mockLink,
})
