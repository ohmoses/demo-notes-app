import { createElement } from "react"
import { ApolloProvider } from "react-apollo-hooks"
import { render } from "react-dom"

import { client } from "./apollo-client"
import { App } from "./view/App"

render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root"),
)
