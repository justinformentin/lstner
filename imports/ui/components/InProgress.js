import React from "react";
import { Link } from "react-router-dom";
import { withTracker } from "meteor/react-meteor-data";
import { graphql } from "react-apollo";
import PropTypes from "prop-types";

import InnerHeader from "./InnerHeader";
import Feed from "./Feed";
import Loader from "./helpers/Loader";

import getInProgress from "../queries/getInProgress";

export const InProgress = props => {
  return (
    <React.Fragment>
      <InnerHeader title="In Progress" />
      <div className="in-progress">
        {props.isLoggedIn ? (
          renderInProgress(props)
        ) : (
          <div className="in-progress__content">
            <h2>To see your in progress episodes Login or Signup.</h2>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

function renderInProgress(props) {
  const { loading, error, inProgress } = props;

  if (loading) return <Loader />;
  if (error) {
    return (
      <div className="error__message">
        Sorry! There was an error loading In Progress episodes.
      </div>
    );
  }

  if (!inProgress || !inProgress.length) {
    return (
      <div className="in-progress__content">
        <h2>No episodes in progress.</h2>
        <div>
          Press play on <Link to="/discover">something new</Link>. You know you
          want to.
        </div>
      </div>
    );
  }

  const filterFeed = inProgress.filter(episode => !episode.isPlayed);

  return <Feed feed={filterFeed} />;
}

InProgress.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.object,
  inProgress: PropTypes.array
};

InProgress.defaultProps = {
  isLoggedIn: false,
  loading: false,
  error: undefined,
  inProgress: []
};

export default withTracker(() => {
  return { isLoggedIn: !!Meteor.userId() };
})(
  graphql(getInProgress, {
    skip: props => !props.isLoggedIn,
    pollInterval: 30000,
    props: ({ data: { loading, error, inProgress } }) => ({
      loading,
      error,
      inProgress
    })
  })(InProgress)
);
