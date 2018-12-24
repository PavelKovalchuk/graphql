import gql from "graphql-tag";

/***
 * create the JavaScript constant called FEED_QUERY that stores the query.
 * The gql function is used to parse the plain string that contains the GraphQL code
 */

/**
 * use to implement pagination and ordering. skip defines the offset where the query will start.
 * If you passed a value of e.g. 10 for this argument,
 * it means that the first 10 items of the list will not be included in the response.
 * first then defines the limit, or how many elements, you want to load from that list.
 * Say, you’re passing the 10 for skip and 5 for first, you’ll receive items 10 to 15 from the list.
 * orderBy defines how the returned list should be sorted.
 */
export const FEED_QUERY = gql`
  query FeedQuery($first: Int, $skip: Int, $orderBy: LinkOrderByInput) {
    feed(first: $first, skip: $skip, orderBy: $orderBy) {
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
      count
    }
  }
`;
