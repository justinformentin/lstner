import React, { Component } from "react";
import { withApollo, compose, graphql } from "react-apollo";
import { withTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import Modal from "react-modal";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";
import { removeFromCache } from "../../utils/apolloCache";

import ModalItem from "./ModalItem";
import Loader from "./Loader";

// Queries for logged user
import getUpnext from "../../queries/getUpnext";
import getPlayingEpisode from "../../queries/getPlayingEpisode";

// Mutations for logged user
import setPlayingEpisode from "../../mutations/setPlayingEpisode";
import removeFromUpnext from "../../mutations/removeFromUpnext";

// Queries for local state
import getLocalUpnext from "../../../localData/queries/getLocalUpnext";
import getLocalPlayingEpisode from "../../../localData/queries/getLocalPlayingEpisode";

// Mutations for local state
import setLocalPlayingEpisode from "../../../localData/mutations/setLocalPlayingEpisode";
import removeFromLocalUpnext from "../../../localData/mutations/removeFromLocalUpnext";

export class UpnextPopup extends Component {
  handleClick(id, podcastId) {
    const {
      isLoggedIn,
      setPlayingEpisode,
      setLocalPlayingEpisode
    } = this.props;

    isLoggedIn
      ? setPlayingEpisode({
          variables: { id, podcastId },
          refetchQueries: [{ query: getPlayingEpisode }, { query: getUpnext }]
        }).catch(err => console.error("Error in setPlayingEpisode.", err))
      : setLocalPlayingEpisode({
          variables: { id, podcastId },
          refetchQueries: [
            { query: getLocalPlayingEpisode },
            { query: getLocalUpnext }
          ]
        }).catch(err => console.error("Error in setLocalPlayingEpisode.", err));
  }

  handleRemove(event, id, podcastId) {
    const {
      isLoggedIn,
      removeFromUpnext,
      removeFromLocalUpnext,
      client
    } = this.props;

    event.stopPropagation();
    isLoggedIn
      ? removeFromUpnext({
          variables: { id, podcastId },
          update: (proxy, { data: { removeFromUpnext } }) => {
            removeFromCache(
              proxy,
              client,
              getUpnext,
              "upnext",
              removeFromUpnext
            );
          }
        }).catch(err => console.error("Error in removeFromUpnext.", err))
      : removeFromLocalUpnext({
          variables: { id, podcastId }
        }).catch(err => console.error("Error in removeFromUpnext.", err));
  }

  renderUpnext(episodes) {
    return isEmpty(episodes) ? (
      <div className="up-next__empty">
        <h2 className="up-next__title">Your Up Next is Empty</h2>
        <p className="empty__text">Add some episodes</p>
      </div>
    ) : (
      <div className="modal__list">
        {episodes.map(episode => {
          if (!episode) return;

          const { id, podcastId } = episode;

          return (
            <div
              key={id}
              className="modal__item"
              onClick={() => this.handleClick(id, podcastId)}
            >
              <ModalItem item={episode} playIcon={true} />
              <div
                className="modal__remove"
                onClick={event => this.handleRemove(event, id, podcastId)}
              />
            </div>
          );
        })}
      </div>
    );
  }

  render() {
    const {
      loading,
      error,
      isModalOpen,
      handleUpnextPopup,
      upnext,
      localUpnext
    } = this.props;
    if (loading) return <Loader />;

    if (error) {
      return <div className="error__message">Sorry! There was an upnext.</div>;
    }

    return (
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => handleUpnextPopup()}
        ariaHideApp={false}
        className="up-next__popup"
        overlayClassName="up-next__popup-overlay"
      >
        <div className="modal__header">
          <h2 className="modal__title">Up Next</h2>
          <div className="modal__close" onClick={() => handleUpnextPopup()} />
        </div>
        {this.renderUpnext(upnext || localUpnext)}
      </Modal>
    );
  }
}

UpnextPopup.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.object,
  isModalOpen: PropTypes.bool.isRequired,
  handleUpnextPopup: PropTypes.func.isRequired,
  upnext: PropTypes.array,
  localUpnext: PropTypes.array,
  isLoggedIn: PropTypes.bool.isRequired,
  setPlayingEpisode: PropTypes.func.isRequired,
  removeFromUpnext: PropTypes.func.isRequired,
  setLocalPlayingEpisode: PropTypes.func.isRequired,
  removeFromLocalUpnext: PropTypes.func.isRequired,
  client: PropTypes.object.isRequired
};

UpnextPopup.defaultProps = {
  loading: false,
  error: null,
  isModalOpen: true,
  handleUpnextPopup: () => {},
  upnext: null,
  localUpnext: null,
  isLoggedIn: false,
  setPlayingEpisode: () => {},
  removeFromUpnext: () => {},
  setLocalPlayingEpisode: () => {},
  removeFromLocalUpnext: () => {},
  client: {}
};

export default withTracker(() => {
  return { isLoggedIn: !!Meteor.userId() };
})(
  compose(
    graphql(getUpnext, {
      skip: props => !props.isLoggedIn,
      props: ({ data: { upnext, error, loading } }) => ({
        upnext,
        error,
        loading
      })
    }),
    graphql(getLocalUpnext, {
      skip: props => props.isLoggedIn,
      props: ({ data: { localUpnext, error, loading } }) => ({
        localUpnext,
        error,
        loading
      })
    }),
    graphql(setPlayingEpisode, { name: "setPlayingEpisode" }),
    graphql(removeFromUpnext, { name: "removeFromUpnext" }),
    graphql(setLocalPlayingEpisode, { name: "setLocalPlayingEpisode" }),
    graphql(removeFromLocalUpnext, { name: "removeFromLocalUpnext" })
  )(withApollo(UpnextPopup))
);
