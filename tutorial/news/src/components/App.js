import React, {Component} from "react";
import LinkList from "./LinkList";
import "../styles/App.css";
import CreateLink from "./CreateLink";

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <LinkList />
        <CreateLink />
      </React.Fragment>
    );
  }
}

export default App;
