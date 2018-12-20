import React from "react";
import Modal from "react-modal";
import PropTypes from "prop-types";
import moment from "moment";
import { graphql } from "react-apollo";
import { isEmpty } from "lodash";

import Loader from "./Loader";
import getEpisodeInfo from "../../queries/getEpisodeInfo";

export const EpisodeModal = props => {
  return (
    <Modal
      isOpen={props.isModalOpen}
      onRequestClose={() => props.handleEpisodeModal()}
      ariaHideApp={false}
      className="episode-modal"
      overlayClassName="episode-modal__overlay"
    >
      {renderContent(props)}
    </Modal>
  );
};

function renderContent(props) {
  const { loading, error, episode, handleEpisodeModal } = props;
  if (loading) return <Loader />;
  if (error || isEmpty(episode)) {
    return (
      <div className="error__message">
        Sorry! There was an error loading episode information.
      </div>
    );
  }
  const { title, author, pubDate, linkToEpisode, description } = episode;

  return (
    <React.Fragment>
      <div className="modal__header">
        <h2 className="modal__title">{title}</h2>
        <div className="modal__close" onClick={() => handleEpisodeModal()} />
        <div className="episode-modal__author">{author}</div>
      </div>

      <div className="episode__details">
        <div className="episode-modal__pub-date">
          Published
          {moment(pubDate).format(" MMM D, YYYY")}
        </div>
        {linkToEpisode ? (
          <a
            className="episode-modal__link-to-episode"
            href={linkToEpisode}
            target="_blank"
          >
            Link to episode
          </a>
        ) : null}
        <div
          className="episode-modal__description"
          dangerouslySetInnerHTML={{
            __html: description
          }}
        />
      </div>
    </React.Fragment>
  );
}

EpisodeModal.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  handleEpisodeModal: PropTypes.func.isRequired,
  podcastId: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.object,
  episode: PropTypes.object
};

EpisodeModal.defaultProps = {
  isModalOpen: true,
  handleEpisodeModal: () => {},
  podcastId: 1093570212,
  id: "1eb0a9034ee1a07aa556df12",
  loading: false,
  error: null,
  episode: null
};

export default graphql(getEpisodeInfo, {
  props: ({ data: { loading, error, episode } }) => ({
    loading,
    error,
    episode
  }),
  options: props => {
    return {
      variables: {
        podcastId: props.podcastId,
        id: props.id
      }
    };
  }
})(EpisodeModal);
