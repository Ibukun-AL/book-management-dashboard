"use client"

import type React from "react"
import { ApolloProvider } from "@apollo/client"
import { apolloClient } from "@/lib/graphql/client"

// Auth0 v4 manages sessions server-side
export function Providers({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
}
