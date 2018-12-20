import React, { Component } from "react";
import { Session } from "meteor/session";
import { withTracker } from "meteor/react-meteor-data";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { graphql, compose } from "react-apollo";
import PropTypes from "prop-types";

import Header from "./Header";
import SideBar from "./SideBar";
import Podcasts from "./Podcasts";
import PodcastPage from "./PodcastPage";
import Discover from "./Discover";
import DiscoverByGenre from "./DiscoverByGenre";
import AudioPlayer from "./AudioPlayer";
import InProgress from "./InProgress";
import Favorites from "./Favorites";
import NewReleases from "./NewReleases";
import Footer from "./Footer";

import getPlayingEpisode from "../queries/getPlayingEpisode";
import getLocalPlayingEpisode from "../../localData/queries/getLocalPlayingEpisode";

export class App extends Component {
  componentDidMount() {
    // If episode in cache it will be available as props on mount
    this.setAudioPlayer();
  }

  componentDidUpdate() {
    // If episode NOT in cache it will be return from queries (if exists)
    this.setAudioPlayer();
  }

  setAudioPlayer() {
    if (this.props.playingEpisode || this.props.localPlayingEpisode) {
      this.props.handlePlayer();
    }
  }

  render() {
    return (
      <BrowserRouter>
        <div className="page-content">
          <Header />
          <div className="page-content__sidebar">
            <SideBar />
          </div>
          <div className="page-content__main">
            <div className="main">
              <Switch>
                <Route path="/" exact component={Podcasts} />
                <Route path="/in-progress" exact component={InProgress} />
                <Route path="/favorites" exact component={Favorites} />
                <Route path="/new-releases" exact component={NewReleases} />
                <Route path="/podcasts/:podcastId" component={PodcastPage} />
                <Route path="/discover" exact component={Discover} />
                <Route path="/discover/:genreId" component={DiscoverByGenre} />
                <Redirect to="/" />
              </Switch>
            </div>
            <Footer />
          </div>
          {this.props.isPlayerOpen ? <AudioPlayer /> : null}
          <div
            onClick={() => this.props.handleNavToggle()}
            className="top-header__overlay"
          />
        </div>
      </BrowserRouter>
    );
  }
}

App.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  isPlayerOpen: PropTypes.bool.isRequired,
  handleNavToggle: PropTypes.func.isRequired,
  handlePlayer: PropTypes.func.isRequired,
  playingEpisode: PropTypes.object,
  localPlayingEpisode: PropTypes.object
};

App.defaultProps = {
  isLoggedIn: false,
  isPlayerOpen: false,
  handleNavToggle: () => {},
  handlePlayer: () => {},
  playingEpisode: null,
  localPlayingEpisode: null
};

export default withTracker(() => {
  return {
    isLoggedIn: !!Meteor.userId(),
    isPlayerOpen: Session.get("isPlayerOpen"),
    handleNavToggle: () => Session.set("isNavOpen", !Session.get("isNavOpen")),
    handlePlayer: () => Session.set("isPlayerOpen", true)
  };
})(
  compose(
    graphql(getPlayingEpisode, {
      skip: props => !props.isLoggedIn,
      props: ({ data: { playingEpisode } }) => ({
        playingEpisode
      })
    }),
    graphql(getLocalPlayingEpisode, {
      skip: props => props.isLoggedIn,
      props: ({ data: { localPlayingEpisode } }) => ({
        localPlayingEpisode
      })
    })
  )(App)
);
