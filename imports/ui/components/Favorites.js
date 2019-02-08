import React from "react";
import { withTracker } from "meteor/react-meteor-data";
import { graphql } from "react-apollo";
import PropTypes from "prop-types";

import InnerHeader from "./InnerHeader";
import Feed from "./Feed";
import Loader from "./helpers/Loader";

import getFavorites from "../queries/getFavorites";

export const Favorites = props => {
  return (
    <React.Fragment>
      <InnerHeader title="Favorites" />
      <div className="favorites">
        {props.isLoggedIn ? (
          renderFavorites(props)
        ) : (
          <div className="favorites__content">
            <h2>To see your in favorite episodes Login or Signup.</h2>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

function renderFavorites(props) {
  const { loading, error, favorites } = props;

  if (loading) return <Loader />;
  if (error) {
    return (
      <div className="error__message">
        Sorry! There was an error loading your favourite episodes.
      </div>
    );
  }

  if (!favorites || !favorites.length) {
    return (
      <div className="favorites__content">
        <h2>No favorites episodes available.</h2>
        <div>It&#8217;s time to find some new favourites.</div>
      </div>
    );
  }

  return <Feed feed={favorites} />;
}

Favorites.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.object,
  favorites: PropTypes.array
};

Favorites.defaultProps = {
  isLoggedIn: false,
  loading: false,
  error: undefined,
  favorites: []
};

export default withTracker(() => {
  return { isLoggedIn: !!Meteor.userId() };
})(
  graphql(getFavorites, {
    skip: props => !props.isLoggedIn,
    pollInterval: 30000,
    props: ({ data: { loading, error, favorites } }) => ({
      loading,
      error,
      favorites
    })
  })(Favorites)
);
