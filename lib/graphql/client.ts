"use client"

import { ApolloClient, InMemoryCache, HttpLink, from, ApolloLink } from "@apollo/client"

const httpLink = new HttpLink({
  uri: "/api/graphql",
  credentials: "include",
})

const errorLink = new ApolloLink((operation, forward) => {
  return forward(operation).map((response) => {
    if (response.errors) {
      console.error("[v0] GraphQL Errors:", JSON.stringify(response.errors, null, 2))
      response.errors.forEach((error) => {
        console.error("[v0] Error message:", error.message)
        console.error("[v0] Error path:", error.path)
        console.error("[v0] Error extensions:", error.extensions)
      })
    }
    return response
  })
})

export const apolloClient = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "network-only",
    },
    query: {
      fetchPolicy: "network-only",
    },
  },
})
