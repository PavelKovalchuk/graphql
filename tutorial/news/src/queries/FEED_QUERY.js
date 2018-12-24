import gql from "graphql-tag";

/***
 * create the JavaScript constant called FEED_QUERY that stores the query.
 * The gql function is used to parse the plain string that contains the GraphQL code
 */

export const FEED_QUERY = gql`
    {
        feed {
            links {
                id
                createdAt
                url
                description
                postedBy {
                    id
                    name
                }
                votes {
                    id
                    user {
                        id
                    }
                }
            }
        }
    }
`;