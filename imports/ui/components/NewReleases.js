import React from "react";
import { Link } from "react-router-dom";
import { withTracker } from "meteor/react-meteor-data";
import { graphql } from "react-apollo";
import PropTypes from "prop-types";

import InnerHeader from "./InnerHeader";
import Loader from "./helpers/Loader";
import Feed from "./Feed";

import getNewReleases from "../queries/getNewReleases";

export const NewReleases = props => {
  return (
    <React.Fragment>
      <InnerHeader title="New Releases" />
      <div className="new-releases">
        {props.isLoggedIn ? (
          renderNewReleases(props)
        ) : (
          <div className="new-releases__content">
            <h2>
              To see new episodes of your subscribed podcasts Login or Signup.
            </h2>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

function renderNewReleases(props) {
  const { loading, error, newReleases } = props;

  if (loading) return <Loader />;
  if (error) {
    return (
      <div className="error__message">
        Sorry! There was an error loading New Releases.
      </div>
    );
  }

  if (!newReleases || !newReleases.length) {
    return (
      <div className="new-releases__content">
        <h2>All caught up!.</h2>
        <div>
          It&#8217;s time to subscribe to some{" "}
          <Link to="/discover">more podcasts</Link>.
        </div>
      </div>
    );
  }

  const feed = newReleases.filter(el => !el.isPlayed);

  return <Feed feed={feed} />;
}

NewReleases.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.object,
  inProgress: PropTypes.array
};

NewReleases.defaultProps = {
  isLoggedIn: false,
  loading: false,
  error: undefined,
  inProgress: []
};

export default withTracker(() => {
  return { isLoggedIn: !!Meteor.userId() };
})(
  graphql(getNewReleases, {
    skip: props => !props.isLoggedIn,
    pollInterval: 30000,
    props: ({ data: { loading, error, newReleases } }) => ({
      loading,
      error,
      newReleases
    })
  })(NewReleases)
);
