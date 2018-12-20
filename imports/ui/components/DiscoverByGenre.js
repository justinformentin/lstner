import React, { Component } from "react";
import { Link } from "react-router-dom";
import { graphql } from "react-apollo";
import PropTypes from "prop-types";

import InnerHeader from "./InnerHeader";
import Loader from "./helpers/Loader";

import fetchPodcastsPreviews from "../queries/fetchPodcastsPreviews";

export class DiscoverByGenre extends Component {
  constructor(props) {
    super(props);

    this.state = {
      limit: 10
    };
  }

  renderPodcasts(podcastsPreviews) {
    return podcastsPreviews.map((podcast, index) => {
      const { id, artwork, title, summary } = podcast;

      if (index >= this.state.limit) return;
      return (
        <div key={id} className="preview">
          <Link className="preview__link" to={`/podcasts/${id}`}>
            <img
              className="preview__image"
              src={artwork}
              alt={`${title} - logo`}
            />
            <div className="preview__info">
              <div className="preview__title">{title}</div>
              {summary ? (
                <div className="preview__description">{summary}</div>
              ) : null}
            </div>
          </Link>
        </div>
      );
    });
  }

  renderContent() {
    const { limit } = this.state;
    const { podcastsPreviews } = this.props;

    return (
      <React.Fragment>
        <div className="preview-list">
          {this.renderPodcasts(podcastsPreviews)}
        </div>
        {limit <= podcastsPreviews.length - 1 ? (
          <button
            className="button button--load"
            onClick={() => this.setState({ limit: limit + 10 })}
          >
            fetch more
          </button>
        ) : null}
      </React.Fragment>
    );
  }

  render() {
    const { loading, error } = this.props;

    if (loading) return <Loader />;

    if (error) {
      return (
        <div className="error__message">
          Sorry! There was an error loading podcast previews.
        </div>
      );
    }

    return (
      <React.Fragment>
        <InnerHeader title="Discover" />
        {this.renderContent()}
      </React.Fragment>
    );
  }
}

DiscoverByGenre.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.object,
  podcastsPreviews: PropTypes.array
};

export default graphql(fetchPodcastsPreviews, {
  props: ({ data: { loading, error, podcastsPreviews } }) => ({
    loading,
    error,
    podcastsPreviews
  }),
  options: props => {
    return {
      variables: {
        genreId: props.match.params.genreId
      }
    };
  }
})(DiscoverByGenre);
