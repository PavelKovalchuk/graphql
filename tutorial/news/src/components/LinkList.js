import React, {Component} from "react";
import Link from "./Link";
import {Query} from "react-apollo";
import {FEED_QUERY} from "../queries/FEED_QUERY";
import {NEW_LINKS_SUBSCRIPTION} from "../queries/NEW_LINKS_SUBSCRIPTION";
import {NEW_VOTES_SUBSCRIPTION} from "../queries/NEW_VOTES_SUBSCRIPTION";


class LinkList extends Component {
  _updateCacheAfterVote = (store, createVote, linkId) => {
    //  reading the current state of the cached data for the FEED_QUERY from the store
    const data = store.readQuery({query: FEED_QUERY});

    const votedLink = data.feed.links.find((link) => link.id === linkId);
    votedLink.votes = createVote.link.votes;

    //  take the modified data and write it back into the store.
    store.writeQuery({query: FEED_QUERY, data});
  };

  _subscribeToNewLinks = (subscribeToMore) => {
    subscribeToMore({
      // document - This represents the subscription query itself.
      document: NEW_LINKS_SUBSCRIPTION,
      /**
       * updateQuery: Similar to cache update prop, this function allows you
       * to determine how the store should be updated with the information that
       * was sent by the server after the event occurred.
       * In fact, it follows exactly the same principle as a Redux reducer
       * @param prev
       * @param subscriptionData
       * @returns {*}
       */
      updateQuery: (prev, {subscriptionData}) => {
        if (!subscriptionData.data) return prev;
        const newLink = subscriptionData.data.newLink.node;

        return Object.assign({}, prev, {
          feed: {
            links: [newLink, ...prev.feed.links],
            count: prev.feed.links.length + 1,
            __typename: prev.feed.__typename,
          },
        });
      },
    });
  };

  _subscribeToNewVotes = (subscribeToMore) => {
    subscribeToMore({
      document: NEW_VOTES_SUBSCRIPTION,
    });
  };

  render() {
    return (
      //  wrap the returned code with <Query /> component passing FEED_QUERY as prop
      // Notice that we’re returning linksToRender as a function result,
      // that’s due to render prop function provided by <Query /> component.
      <Query query={FEED_QUERY}>
        {({loading, error, data, subscribeToMore}) => {
          if (loading) {
            return <div>Fetching</div>;
          }
          if (error) {
            return <div>Error</div>;
          }

          // This call opens up a websocket connection to the subscription server.
          this._subscribeToNewLinks(subscribeToMore);
          this._subscribeToNewVotes(subscribeToMore);

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
