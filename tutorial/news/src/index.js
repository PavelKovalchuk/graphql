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
import {split} from "apollo-link";
import {WebSocketLink} from "apollo-link-ws";
import {getMainDefinition} from "apollo-utilities";

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

/**
 *  wsLink represents the WebSocket connection.
 *  Use split for proper “routing” of the requests and update the constructor call of ApolloClient.
 *  knows the subscriptions endpoint.
 *  also authenticating the websocket connection with the user’s token that you retrieve from localStorage
 * @type {WebSocketLink}
 */
const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000`,
  options: {
    reconnect: true,
    connectionParams: {
      authToken: localStorage.getItem(AUTH_TOKEN),
    },
  },
});

/**
 * split is used to “route” a request to a specific middleware link.
 *  It takes three arguments, the first one is a test function which returns a boolean.
 *  The remaining two arguments are again of type ApolloLink.
 *  If test returns true, the request will be forwarded to the link passed as the second argument.
 *  If false, to the third one.
 *  In your case, the test function is checking whether the requested operation is a subscription.
 * @type {ApolloLink}
 */
const link = split(
  ({query}) => {
    const {kind, operation} = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  authLink.concat(httpLink)
);

const client = new ApolloClient({
  link,
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
