import React, {Component} from "react";
import {AUTH_TOKEN} from "../constants";
import {timeDifferenceForDate} from "../utils";
import Mutation from "react-apollo/Mutation";
import {VOTE_MUTATION} from "../queries/VOTE_MUTATION";

class Link extends Component {
  render() {
    const authToken = localStorage.getItem(AUTH_TOKEN);
    return (
      <div className="flex mt2 items-start">
        <div className="flex items-center">
          <span className="gray">{this.props.index + 1}.</span>
          {authToken && (
            <Mutation
              mutation={VOTE_MUTATION}
              variables={{linkId: this.props.link.id}}
              /**
               * will be called directly after the server returned the response.
               * It receives the payload of the mutation (data) and the current cache (store) as arguments.
               * You can then use this input to determine a new state for the cache.
               */
              update={(store, {data: {vote}}) => {
                console.log("update store", store);
                console.log("update vote", vote);
                this.props.updateStoreAfterVote(store, vote, this.props.link.id);
              }}
            >
              {(voteMutation) => (
                <div className="ml1 gray f11" onClick={voteMutation}>
                  ▲
                </div>
              )}
            </Mutation>
          )}
        </div>
        <div className="ml1">
          <div>
            {this.props.link.description} ({this.props.link.url})
          </div>
          <div className="f6 lh-copy gray">
            {this.props.link.votes.length} votes | by{" "}
            {this.props.link.postedBy ? this.props.link.postedBy.name : "Unknown"}{" "}
            {timeDifferenceForDate(this.props.link.createdAt)}
          </div>
        </div>
      </div>
    );
  }
}

export default Link;
