import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { createClient as createWSClient } from 'graphql-ws'
import { setContext } from '@apollo/client/link/context'
import { nhost } from '@/lib/nhost'

function createAuthLink() {
  return setContext((_, { headers }) => {
    const accessToken = nhost.auth.getAccessToken()
    return {
      headers: {
        ...headers,
        authorization: accessToken ? `Bearer ${accessToken}` : '',
        'x-hasura-role': 'user',
      },
    }
  })
}

function createHttpLink() {
  return new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_HTTP,
  })
}

function createWsLink() {
  if (typeof window === 'undefined') {
    return null
  }
  const wsClient = createWSClient({
    url: process.env.NEXT_PUBLIC_GRAPHQL_WS as string,
    connectionParams: () => {
      const accessToken = nhost.auth.getAccessToken()
      return {
        headers: {
          authorization: accessToken ? `Bearer ${accessToken}` : '',
          'x-hasura-role': 'user',
        },
      }
    },
  })
  return new GraphQLWsLink(wsClient)
}

export function createApolloClient() {
  const authLink = createAuthLink()
  const httpLink = createHttpLink()
  const wsLink = createWsLink()

  const link = wsLink
    ? split(
        ({ query }) => {
          const def = getMainDefinition(query)
          return def.kind === 'OperationDefinition' && def.operation === 'subscription'
        },
        wsLink,
        authLink.concat(httpLink),
      )
    : authLink.concat(httpLink)

  return new ApolloClient({
    link,
    cache: new InMemoryCache(),
    connectToDevTools: process.env.NODE_ENV !== 'production',
  })
}

let apolloSingleton: ApolloClient<any> | null = null

export function getApolloClient() {
  if (!apolloSingleton) {
    apolloSingleton = createApolloClient()
  }
  return apolloSingleton
}


