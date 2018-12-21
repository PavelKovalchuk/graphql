import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";
import App from "./components/App";
import * as serviceWorker from "./serviceWorker";
import {ApolloProvider} from "react-apollo";
import {ApolloClient} from "apollo-client";
import {createHttpLink} from "apollo-link-http";
import {InMemoryCache} from "apollo-cache-inmemory";
import {BrowserRouter} from "react-router-dom";
import {AUTH_TOKEN} from "./constants";
import {setContext} from "apollo-link-context";

/**
 * will connect your ApolloClient instance with the GraphQL API,
 * your GraphQL server will be running on http://localhost:4000
 * @type {ApolloLink}
 */
const httpLink = createHttpLink({
  uri: "http://localhost:4000",
});

/**
 * Apollo provides a nice way for authenticating all requests
 * by using the concept of middleware, implemented as an Apollo Link.
 * This middleware will be invoked every time ApolloClient sends a request to the server.
 * Apollo Links allow to create middlewares that let you modify requests before they are sent to the server.
 * @type {ApolloLink}
 */
const authLink = setContext((_, {headers}) => {
  const token = localStorage.getItem(AUTH_TOKEN);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
