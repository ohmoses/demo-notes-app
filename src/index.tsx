import React from "react"
import { ApolloProvider } from "react-apollo-hooks"
import { render } from "react-dom"
import { StoreContext } from "redux-react-hook"

import { client } from "./apollo-client"
import { setWindowSize } from "./model"
import { store } from "./store"
import { debounce, pixelsToSize } from "./utils"
import { App } from "./view/App"

import "./view/global-css/normalize.css"

import "./view/global-css/main.scss"

const setSize = () =>
  store.dispatch(setWindowSize(pixelsToSize(window.innerWidth)))

window.onresize = debounce(setSize, 100)

setSize()

render(
  <StoreContext.Provider value={store}>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StoreContext.Provider>,
  document.getElementById("root"),
)
