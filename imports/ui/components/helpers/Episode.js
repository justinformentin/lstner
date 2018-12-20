import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";

import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";

const Episode = ({
  episode,
  className,
  handleEpisodeModal,
  handleFavorites,
  handleStatus,
  handleUpnext,
  handleClick
}) => {
  const {
    inFavorites,
    inUpnext,
    isPlayed,
    podcastArtworkUrl,
    podcastId,
    id,
    title,
    author,
    pubDate,
    duration
  } = episode;

  if (isEmpty(episode)) {
    return null;
  }

  return (
    <div className={className}>
      {podcastArtworkUrl ? (
        <Link to={`/podcasts/${podcastId}`}>
          <div
            className="episode__artwork"
            style={{
              backgroundImage: `url("${podcastArtworkUrl}")`
            }}
          />
        </Link>
      ) : null}
      <div className="episode__info">
        <div className="episode__primary">
          <div className="episode__title">
            <p
              className="title__text"
              title={title}
              onClick={() => handleEpisodeModal(id, podcastId)}
            >
              {title}
            </p>
            <div
              id="star__icon"
              onClick={() => handleFavorites(id, podcastId, inFavorites)}
            >
              {starSvg}
            </div>
          </div>
        </div>

        {author ? (
          <p className="episode__author">
            <Link to={`/podcasts/${podcastId}`}>{author}</Link>
          </p>
        ) : null}
      </div>
      <div className="episode__pub-date">
        <p>{formatDate(pubDate)}</p>
      </div>
      <div className="episode__duration">
        <p>{formatDuration(duration)}</p>
      </div>
      <div className="episode__controls">
        <div
          id="controls__status-icon"
          onClick={() => handleStatus(id, podcastId, isPlayed)}
        >
          {statusSvg}
        </div>
        <div
          id="controls__up-next"
          onClick={() => handleUpnext(id, podcastId, inUpnext)}
        >
          {upnextSvg}
        </div>
        <div id="controls__play" onClick={() => handleClick(id, podcastId)}>
          {playSvg}
        </div>
      </div>
    </div>
  );
};

function formatDate(date) {
  if (date && moment(date).isValid()) {
    const format =
      moment(date).year() === moment().year() ? "MMM D" : "MMM D, YYYY";
    return moment(date).format(format);
  }
  return "";
}

function formatDuration(seconds) {
  if (!seconds) return "";
  return moment.duration(seconds, "seconds").format();
}

Episode.propTypes = {
  episode: PropTypes.object.isRequired,
  className: PropTypes.string.isRequired,
  handleEpisodeModal: PropTypes.func.isRequired,
  handleFavorites: PropTypes.func.isRequired,
  handleStatus: PropTypes.func.isRequired,
  handleUpnext: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired
};

Episode.defaultProps = {
  episode: null,
  className: "episode",
  handleEpisodeModal: () => {},
  handleFavorites: () => {},
  handleStatus: () => {},
  handleUpnext: () => {},
  handleClick: () => {}
};

export default Episode;

const starSvg = (
  <svg
    className="star__icon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 168.8 160.5"
  >
    <path d="M168.8 61.3l-58.3-8.5L84.4 0 58.3 52.8 0 61.3l42.2 41.1-10 58.1 52.2-27.4 52.2 27.4-10-58.1 42.2-41.1z" />
  </svg>
);

const statusSvg = (
  <svg
    className="controls__status-icon"
    viewBox="0 0 406 299"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      className="status-icon__unplayed"
      d="M398 7a25 25 0 0 0-35 0L132 239 43 150a25 25 0 0 0-35 0 25 25 0 0 0 0 35l106 106a25 25 0 0 0 31 3 25 25 0 0 0 6-5L398 43a25 25 0 0 0 0-35z"
    />
    <path
      className="status-icon__played"
      d="M238 149L344 43a25 25 0 0 0 0-35 25 25 0 0 0-35 0L203 114 97 8a25 25 0 0 0-35 0 25 25 0 0 0 0 35L167 149 61 255a25 25 0 0 0 0 35 25 25 0 0 0 35 0l106-106 106 106a25 25 0 0 0 35 0 25 25 0 0 0 0-35z"
    />
  </svg>
);

const upnextSvg = (
  <svg
    className="controls__up-next"
    viewBox="0 0 179 153"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      className="up-next__add"
      d="M173 30h-24V6a6 6 0 1 0-12 0v24h-24a6 6 0 0 0-6 6 6 6 0 0 0 6 6h24v24a6 6 0 1 0 12 0V42H173a6 6 0 0 0 6-6 6 6 0 0 0-6-6z"
    />
    <rect y="78" width="150" height="25" rx="13" ry="13" />
    <rect y="128" width="150" height="25" rx="13" ry="13" />
    <rect y="28" width="100" height="25" rx="13" ry="13" />
    <path
      className="up-next__remove"
      d="M162 6l-20 20-20-20a7 7 0 0 0-10 10l20 20-20 20a7 7 0 0 0 0 10 7 7 0 0 0 10 0l20-20L162 66a7 7 0 0 0 10-10l-20-20 20-20a7 7 0 0 0 0-10 7 7 0 0 0-10 0z"
    />
  </svg>
);

const playSvg = (
  <svg
    className="controls__play"
    viewBox="0 0 250 250"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle className="play__circle" cx="125" cy="125" r="115" />
    <path d="M125,20A105,105,0,1,1,20,125,105,105,0,0,1,125,20m0-20A125,125,0,1,0,250,125,125,125,0,0,0,125,0Z" />
    <g className="play__inner">
      <g className="play__bars">
        <rect x="93" y="88" width="15" height="75" />
        <polygon points="118 78 83 78 83 173 118 173 118 78" />
        <rect x="143" y="88" width="15" height="75" />
        <polygon points="168 78 133 78 133 173 168 173 168 78" />
      </g>
      <path className="play__triangle" d="m183 125-87 50v-101z" />
    </g>
  </svg>
);
