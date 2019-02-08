import React from "react";
import { Link } from "react-router-dom";
import { withTracker } from "meteor/react-meteor-data";
import { graphql } from "react-apollo";
import PropTypes from "prop-types";

import Loader from "./helpers/Loader";
import InnerHeader from "./InnerHeader";

import getSubscribedPodcasts from "../queries/getSubscribedPodcasts";

export const Podcasts = props => {
  return (
    <React.Fragment>
      <InnerHeader title="Podcasts" />
      <div className="podcasts">
        {props.isLoggedIn ? (
          renderPodcasts(props)
        ) : (
          <div className="podcasts__content">
            <h2>To see your subscribed podcasts Login or Signup.</h2>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

function renderPodcasts(props) {
  const { loading, error, podcasts } = props;

  if (loading) return <Loader />;
  if (error) {
    return (
      <div className="error__message">
        Sorry! There was an error loading your Sunscribed Podcasts.
      </div>
    );
  }

  if (!podcasts || !podcasts.length) {
    return (
      <div className="podcasts__content">
        <h2>Oh no! It&#8217;s empty!</h2>
        <div>
          Head to <Link to="/discover">Discover section</Link>, to find
          something you interested in.
        </div>
      </div>
    );
  }

  const podcastsList = podcasts.map(podcast => {
    if (!podcast) return;
    return (
      <div key={podcast.podcastId} className="podcasts__card">
        <Link to={`/podcasts/${podcast.podcastId}`}>
          <img className="podcasts__image" src={podcast.artworkUrl} alt="" />
        </Link>
      </div>
    );
  });
  return <div className="podcasts__cards">{podcastsList}</div>;
}

Podcasts.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.object,
  podcasts: PropTypes.array
};

Podcasts.defaultProps = {
  isLoggedIn: false,
  loading: false,
  error: undefined,
  podcasts: []
};

export default withTracker(() => {
  return { isLoggedIn: !!Meteor.userId() };
})(
  graphql(getSubscribedPodcasts, {
    skip: props => !props.isLoggedIn,
    pollInterval: 30000,
    props: ({ data: { loading, error, podcasts } }) => ({
      loading,
      error,
      podcasts
    })
  })(Podcasts)
);
