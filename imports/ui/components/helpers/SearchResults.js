import React from "react";
import { Session } from "meteor/session";
import { graphql } from "react-apollo";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";

import Loader from "./Loader";
import ModalItem from "./ModalItem";

import doSearch from "../../queries/doSearch";

export const SearchResults = ({ loading, error, searchPreviews }) => {
  if (loading) return <Loader />;
  if (error || isEmpty(searchPreviews)) {
    return (
      <div className="error__message">
        Sorry! There was an error loading search results.
      </div>
    );
  }

  return <div className="modal__list">{renderResults(searchPreviews)}</div>;
};

function renderResults(results) {
  const previews = Array.isArray(results) ? results : [results];
  return previews.map(preview => {
    return (
      <Link
        className="modal__item"
        onClick={() => closeSearchModal()}
        key={preview.podcastId}
        to={`/podcasts/${preview.podcastId}`}
      >
        <ModalItem item={preview} />
      </Link>
    );
  });
}

function closeSearchModal() {
  Session.set("isSearchModelOpen", false);
}

SearchResults.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.object,
  searchPreviews: PropTypes.array
};

SearchResults.defaultProps = {
  loading: false,
  error: null,
  searchPreviews: null
};

export default graphql(doSearch, {
  props: ({ data: { loading, error, searchPreviews } }) => ({
    loading,
    error,
    searchPreviews
  }),
  options: props => {
    return {
      variables: {
        searchTerm: props.searchTerm
      }
    };
  }
})(SearchResults);
