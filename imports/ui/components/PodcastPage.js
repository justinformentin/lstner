import React, { Component } from "react";
import { Query } from "react-apollo";
import moment from "moment";
import { isEqual } from "lodash";

import InnerHeader from "./InnerHeader";
import Feed from "./Feed";
import Loader from "./helpers/Loader";
import SubscribeButton from "./helpers/SubscribeButton";

import getPodcast from "../queries/getPodcast";
import getFeed from "../queries/getFeed";

class PodcastPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      limit: 100
    };
  }

  // To prevent refetching episodes when parent component updates
  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props, nextProps);
  }

  isUpdateNeeded(time) {
    return moment(moment().valueOf()).diff(+time, "hours") >= 1;
  }

  renderFeed(podcastId) {
    return (
      <Query
        query={getFeed}
        variables={{
          podcastId,
          limit: this.state.limit
        }}
      >
        {({ loading, error, data, refetch, fetchMore }) => {
          if (loading) return <Loader />;
          if (error) {
            return (
              <div className="error__message">
                Sorry! There was an error loading feed.
              </div>
            );
          }

          const { feed, podcast } = data;
          if (!feed || !feed.length) return <div>There is no episodes.</div>;

          if (this.isUpdateNeeded(podcast.updatedAt)) {
            setTimeout(() => refetch(), 5000);
          }

          return (
            <React.Fragment>
              <Feed feed={feed} />

              {feed.length >= this.state.limit ? (
                <button
                  className="button button--load"
                  onClick={() => {
                    this.setState({ limit: feed.length + 100 }, () => {
                      //https://www.apollographql.com/docs/react/features/pagination.html#numbered-pages
                      fetchMore({
                        variables: {
                          limit: this.state.limit
                        },
                        updateQuery: (prev, { fetchMoreResult }) => {
                          if (!fetchMoreResult) return prev;
                          return Object.assign({}, prev, {
                            feed: fetchMoreResult.feed
                          });
                        }
                      });
                    });
                  }}
                >
                  load more
                </button>
              ) : null}
            </React.Fragment>
          );
        }}
      </Query>
    );
  }

  renderPodcast() {
    return (
      <Query
        query={getPodcast}
        variables={{
          podcastId: this.props.match.params.podcastId
        }}
      >
        {({ loading, error, data }) => {
          if (loading) return <Loader />;
          if (error || !data.podcast) {
            return <div>Sorry! There was an error loading your podcast.</div>;
          }
          const {
            artworkUrl,
            title,
            website,
            author,
            summary,
            description,
            podcastId,
            subscribed
          } = data.podcast;

          return (
            <div className="podcast">
              <div className="podcast__header">
                <div>
                  <img
                    className="podcast__image"
                    src={artworkUrl}
                    alt={`${title} artwork`}
                  />
                </div>
                <div className="podcast__info">
                  <h1 className="podcast__title">{title}</h1>
                  <h2>
                    <a className="podcast__link" href={website} target="_blank">
                      {author}
                    </a>
                  </h2>
                  <p
                    className="podcast__description"
                    dangerouslySetInnerHTML={{
                      __html: summary || description
                    }}
                  />
                </div>
              </div>

              <SubscribeButton subscribed={subscribed} podcastId={podcastId} />

              {this.renderFeed(podcastId)}
            </div>
          );
        }}
      </Query>
    );
  }

  render() {
    return (
      <React.Fragment>
        <InnerHeader />
        {this.renderPodcast()}
      </React.Fragment>
    );
  }
}

export default PodcastPage;
