import "core-js/es6";
import "classlist-polyfill";
import "whatwg-fetch";

import { Meteor } from "meteor/meteor";
import React, { Component } from "react";
import { Session } from "meteor/session";
import { Tracker } from "meteor/tracker";
import { render } from "react-dom";
import { merge } from "lodash";
import {
  HttpLink,
  InMemoryCache,
  ApolloLink,
  defaultDataIdFromObject
} from "apollo-boost";
import { withClientState } from "apollo-link-state";
import { CachePersistor } from "apollo-cache-persist";
import ApolloClient from "apollo-client";
import { ApolloProvider } from "react-apollo";

import App from "../../ui/components/App";
import Loader from "../../ui/components/helpers/Loader";

import playingEpisode from "../../localData/resolvers/playingEpisode";
import playingStatus from "../../localData/resolvers/playingStatus";

const httpLink = new HttpLink({
  uri: Meteor.absoluteUrl("graphql")
});

const authLink = new ApolloLink((operation, forward) => {
  const token = Accounts._storedLoginToken();
  operation.setContext(() => ({
    headers: {
      "meteor-login-token": token
    }
  }));
  return forward(operation);
});

const cache = new InMemoryCache({
  dataIdFromObject: object => {
    switch (object.__typename) {
      case "Episode":
        return object.id;
      case "Podcast":
        return object.podcastId;
      case "UserData":
        return object._id;

      default:
        return defaultDataIdFromObject(object);
    }
  }
});

const persistor = new CachePersistor({
  cache,
  storage: window.localStorage,
  maxSize: 4194304 //4mb
});

const defaultState = {
  isPlaying: false,
  localPlayingEpisode: null,
  localUpnext: [],
  localInProgress: []
};

const stateLink = withClientState({
  cache,
  resolvers: merge(playingStatus, playingEpisode),
  defaults: defaultState
});

const client = new ApolloClient({
  // ORDER MATTER!!
  link: ApolloLink.from([authLink, stateLink, httpLink]),
  cache
});

client.onResetStore(stateLink.writeDefaults);

// https://github.com/apollographql/apollo-link-state/issues/170
// https://gist.github.com/randytorres/2d8c36f567a1be7ddb89bb7b8ca7929d
class Root extends Component {
  constructor(props) {
    super(props);
    this.state = {
      restored: false
    };
  }

  componentDidMount() {
    persistor
      .restore()
      .then(() => this.setState({ restored: true }))
      .catch(err => console.log("Error in persistor.restore()", err));
  }

  render() {
    return this.state.restored ? (
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    ) : (
      <Loader />
    );
  }
}

Tracker.autorun(() => {
  const isNavOpen = Session.get("isNavOpen");
  document.body.classList.toggle("nav-is-open", isNavOpen);
});

Tracker.autorun(() => {
  const isPlayerOpen = Session.get("isPlayerOpen");
  document.body.classList.toggle("player-is-open", isPlayerOpen);
});

Meteor.startup(() => {
  Session.set("isSearchModelOpen", false);
  Session.set("isNavOpen", false);
  Session.set("isPlayerOpen", false);
  render(<Root />, document.getElementById("app"));
});
