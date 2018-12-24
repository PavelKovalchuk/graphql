import React, {Component} from "react";
import Link from "./Link";
import {Query} from "react-apollo";
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

class LinkList extends Component {
  _updateCacheAfterVote = (store, createVote, linkId) => {
    //  reading the current state of the cached data for the FEED_QUERY from the store
    const data = store.readQuery({query: FEED_QUERY});

    const votedLink = data.feed.links.find((link) => link.id === linkId);
    votedLink.votes = createVote.link.votes;

    //  take the modified data and write it back into the store.
    store.writeQuery({query: FEED_QUERY, data});
  };

  render() {
    return (
      //  wrap the returned code with <Query /> component passing FEED_QUERY as prop
      // Notice that we’re returning linksToRender as a function result,
      // that’s due to render prop function provided by <Query /> component.
      <Query query={FEED_QUERY}>
        {({loading, error, data}) => {
          if (loading) {
            return <div>Fetching</div>;
          }
          if (error) {
            return <div>Error</div>;
          }

          const linksToRender = data.feed.links;

          return (
            <div>
              {linksToRender.map((link, index) => (
                <Link key={link.id} link={link} index={index} updateStoreAfterVote={this._updateCacheAfterVote} />
              ))}
            </div>
          );
        }}
      </Query>
    );
  }
}

export default LinkList;
