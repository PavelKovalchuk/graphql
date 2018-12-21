import React, {Component} from "react";
import Link from "./Link";
import {Query} from "react-apollo";
import gql from "graphql-tag";

/***
 * create the JavaScript constant called FEED_QUERY that stores the query.
 * The gql function is used to parse the plain string that contains the GraphQL code
 */
const FEED_QUERY = gql`
  {
    feed {
      links {
        id
        createdAt
        url
        description
      }
    }
  }
`;

class LinkList extends Component {
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
              {linksToRender.map((link) => (
                <Link key={link.id} link={link} />
              ))}
            </div>
          );
        }}
      </Query>
    );
  }
}

export default LinkList;
