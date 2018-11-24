import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import fetchSong from '../queries/fetchSong';

class SongDetail extends Component {

  render() {
    console.log(this.props);
    return (
      <div>
        <h3>Song detail</h3>
      </div>
    );
  }
}


export default graphql(fetchSong, {
  options: (props) => {
    return {
      variables: {id: props.params.id}
    }
  }
})(SongDetail);
