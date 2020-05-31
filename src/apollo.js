import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

const BASE_URL = "https://graphql-pokemon.now.sh/graphql";

class ApolloClientProvider {
  constructor() {
    const httpLink = new HttpLink({
      uri: BASE_URL
    });

    this.client = new ApolloClient({
      link: httpLink,
      cache: new InMemoryCache({
        typePolicies: {
          Query: {
            fields: {
              pokemon(existingData, { args, toReference }) {
                return existingData || toReference({ __typename: 'Pokemon', id: args?.id });
              }
            }
          },
        }
      }),
      connectToDevTools: true
    });
  }
}

export const apolloClient = new ApolloClientProvider().client;
