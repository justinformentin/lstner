import React from "react";
import { graphql } from "react-apollo";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import InnerHeader from "./InnerHeader";
import Loader from "./helpers/Loader";

import fetchGenres from "../queries/fetchGenres";

export const Discover = ({ loading, error, genres }) => {
  if (error) {
    return (
      <div className="error__message">
        Sorry! There was an error loading genres.
      </div>
    );
  }

  return (
    <React.Fragment>
      <InnerHeader title="Discover" />
      {loading ? <Loader /> : renderGenres(genres)}
    </React.Fragment>
  );
};

function renderGenres(arr) {
  return (
    <ul className="genre-nav">
      {arr.map(({ id, name, subgenres }) => {
        return (
          <li className="genre-nav__group" key={id}>
            <Link
              title={name}
              className="genre-nav__group-title"
              to={`discover/${id}`}
            >
              {name}
            </Link>
            {subgenres.length !== 0 ? (
              <ul className="genre-nav__subgenre-group">
                {subgenres.map(el => {
                  return (
                    <li key={el.id}>
                      <Link
                        className="genre-nav__subgenre-item"
                        to={`discover/${el.id}`}
                      >
                        {el.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

Discover.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.object,
  genres: PropTypes.array
};

export default graphql(fetchGenres, {
  props: ({ data: { loading, error, genres } }) => ({
    loading,
    error,
    genres
  })
})(Discover);
