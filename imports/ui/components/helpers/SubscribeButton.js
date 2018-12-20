import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";
import { withApollo, compose, graphql } from "react-apollo";
import { removeFromCache, addToCache } from "../../utils/apolloCache";

import LoginWarningModal from "./LoginWarningModal";
import UnsubscribeModal from "./UnsubscribeModal";

import getNewReleases from "../../queries/getNewReleases";
import getSubscribedPodcasts from "../../queries/getSubscribedPodcasts";

import subscribeToPodcast from "../../mutations/subscribeToPodcast";
import unsubscribeFromPodcast from "../../mutations/unsubscribeFromPodcast";

export class SubscribeButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isWarningModalOpen: false,
      isUnsubscribeModalOpen: false
    };

    this.closeWarningModal = this.closeWarningModal.bind(this);
    this.closeUnsubscribeModal = this.closeUnsubscribeModal.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
  }

  openWarningModal() {
    this.setState({ isWarningModalOpen: true });
  }

  closeWarningModal() {
    this.setState({ isWarningModalOpen: false });
  }

  openUnsubscribeModal() {
    this.setState({ isUnsubscribeModalOpen: true });
  }

  closeUnsubscribeModal() {
    this.setState({ isUnsubscribeModalOpen: false });
  }

  handleSubscibe(subscribed) {
    this.props.isLoggedIn
      ? this.loggedHandleSubscibe(subscribed)
      : this.openWarningModal();
  }

  loggedHandleSubscibe(subscribed) {
    subscribed ? this.openUnsubscribeModal() : this.subscribe();
  }

  subscribe() {
    const { podcastId, subscribe, client } = this.props;

    subscribe({
      variables: { podcastId },
      refetchQueries: [{ query: getNewReleases }],
      update: (proxy, { data: { subscribe } }) => {
        addToCache(proxy, client, getSubscribedPodcasts, "podcasts", subscribe);
      }
    }).catch(err => console.log("Error in subscribe", err));
  }

  unsubscribe() {
    const { podcastId, unsubscribe, client } = this.props;

    unsubscribe({
      variables: { podcastId },
      refetchQueries: [{ query: getNewReleases }],
      update: (proxy, { data: { unsubscribe } }) => {
        removeFromCache(
          proxy,
          client,
          getSubscribedPodcasts,
          "podcasts",
          unsubscribe
        );
      }
    }).catch(err => console.log("Error in unsubscribe", err));
  }

  render() {
    const { isWarningModalOpen, isUnsubscribeModalOpen } = this.state;
    const { podcastId, subscribed } = this.props;

    const className = `subscribe-btn ${
      subscribed ? " subscribe-btn--subscribed" : ""
    }`;

    return (
      <div className="podcast__subscribe">
        <button
          onClick={() => {
            this.handleSubscibe(subscribed);
          }}
          className={className}
        />

        {isWarningModalOpen ? (
          <LoginWarningModal
            isModalOpen={isWarningModalOpen}
            closeWarningModal={this.closeWarningModal}
          />
        ) : null}

        {isUnsubscribeModalOpen ? (
          <UnsubscribeModal
            isModalOpen={isUnsubscribeModalOpen}
            closeUnsubscribeModal={this.closeUnsubscribeModal}
            unsubscribe={this.unsubscribe}
            podcastId={podcastId}
          />
        ) : null}
      </div>
    );
  }
}

SubscribeButton.propTypes = {
  podcastId: PropTypes.number.isRequired,
  subscribed: PropTypes.bool.isRequired,
  subscribe: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  client: PropTypes.object.isRequired
};

SubscribeButton.defaultProps = {
  podcastId: 928159684,
  subscribed: false,
  subscribe: () => {},
  isLoggedIn: false,
  client: {}
};

export default withTracker(() => {
  return { isLoggedIn: !!Meteor.userId() };
})(
  compose(
    graphql(subscribeToPodcast, { name: "subscribe" }),
    graphql(unsubscribeFromPodcast, { name: "unsubscribe" })
  )(withApollo(SubscribeButton))
);
