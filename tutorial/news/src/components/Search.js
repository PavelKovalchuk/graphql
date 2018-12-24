import React, {Component} from "react";
import {withApollo} from "react-apollo";
import gql from "graphql-tag";
import Link from "./Link";

const FEED_SEARCH_QUERY = gql`
  query FeedSearchQuery($filter: String!) {
    feed(filter: $filter) {
      links {
        id
        url
        description
        createdAt
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

class Search extends Component {
  state = {
    links: [],
    filter: "",
  };

  render() {
    return (
      <div>
        <div>
          Search
          <input type="text" onChange={(e) => this.setState({filter: e.target.value})} />
          <button onClick={() => this._executeSearch()}>OK</button>
        </div>
        {this.state.links.map((link, index) => (
          <Link key={link.id} link={link} index={index} />
        ))}
      </div>
    );
  }

  _executeSearch = async () => {
    console.log("Search this.props.client", this.props.client);
    const {filter} = this.state;
    const result = await this.props.client.query({
      query: FEED_SEARCH_QUERY,
      variables: {filter},
    });
    const links = result.data.feed.links;
    this.setState({links});
  };
}

/**
 * That’s the purpose of the withApollo function.
 * This function injects the ApolloClient instance that you created in index.js
 * into the Search component as a new prop called client.

 This client has a method called query which you can use to send a query manually
 instead of using the graphql higher-order component.
 */
export default withApollo(Search);
