import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { Link } from "react-router-dom";
import moment from "moment";
import PropTypes from "prop-types";
import momentDurationFormatSetup from "moment-duration-format";
import { graphql, compose } from "react-apollo";
import update from "immutability-helper";

import UpnextPopup from "./helpers/UpnextPopup";
import EpisodeModal from "./helpers/EpisodeModal";

// Queries for logged user
import getUpnext from "../queries/getUpnext";
import getPlayingEpisode from "../queries/getPlayingEpisode";

// Mutations for logged user
import markAsPlayed from "../mutations/markAsPlayed";
import updatePlayedSeconds from "../mutations/updatePlayedSeconds";
import clearPlayingEpisode from "../mutations/clearPlayingEpisode";

// Queries for local state
import getLocalUpnext from "../../localData/queries/getLocalUpnext";
import getLocalPlayingEpisode from "../../localData/queries/getLocalPlayingEpisode";

// Mutations for local state
import markLocalAsPlayed from "../../localData/mutations/markLocalAsPlayed";
import updateLocalPlayedSeconds from "../../localData/mutations/updateLocalPlayedSeconds";
import clearLocalPlayingEpisode from "../../localData/mutations/clearLocalPlayingEpisode";

import isPLaying from "../../localData/queries/isPlaying";
import play from "../../localData/mutations/play";
import pause from "../../localData/mutations/pause";

export class AudioPlayer extends Component {
  constructor(props) {
    super(props);

    this.player = React.createRef();

    this.state = {
      episode: null,
      isReady: false,
      isPlaying: false,
      mounted: false,
      isLoading: true,
      isMuted: false,
      volume: 1,
      lastVolume: 0,
      duration: 0,
      playbackRate: 1,
      minPlaybackRate: 0.5,
      maxPlaybackRate: 4,
      playbackStep: 0.1,
      isPopupOpen: false,
      isModalOpen: false
    };

    this.handleEpisodeModal = this.handleEpisodeModal.bind(this);
    this.handleUpnextPopup = this.handleUpnextPopup.bind(this);
  }

  componentDidMount() {
    const playingEpisode =
      this.props.playingEpisode || this.props.localPlayingEpisode;

    this.setState({ mounted: true });
    if (playingEpisode) {
      this.setState({ episode: playingEpisode });
    }

    this.updatePlayedSeconds();
    this.getSeconds();
  }

  // When isPlaying change from Episode component
  componentDidUpdate(prevProps, prevState) {
    const { isPlaying } = this.props;
    if (prevState.isPlaying !== isPlaying) {
      this.setState({ isPlaying });
      isPlaying ? this.player.current.play() : this.player.current.pause();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.getSecondsTimeout);
    clearTimeout(this.updatePlayedSecondsTimeout);
  }

  componentWillReceiveProps(nextProps) {
    const { episode } = this.state;
    const nextEpisode =
      nextProps.playingEpisode || nextProps.localPlayingEpisode;

    if (!nextEpisode) {
      this.clearEpisode();
      return;
    }

    if (!episode || episode.mediaUrl !== nextEpisode.mediaUrl) {
      this.setState(
        {
          isLoading: true,
          episode: nextEpisode
        },
        () => {
          this.props.pause();
        }
      );
    }
  }

  getSeconds() {
    const { episode, isReady, isPlaying } = this.state;
    if (episode && this.player.current && isReady && isPlaying) {
      this.setState({
        episode: update(this.state.episode, {
          playedSeconds: { $set: +this.player.current.currentTime.toFixed(2) }
        })
      });
    }

    const that = this;
    this.getSecondsTimeout = setTimeout(() => that.getSeconds(), 500);
  }

  updatePlayedSeconds() {
    const { episode, isReady, isPlaying } = this.state;
    const {
      isLoggedIn,
      updatePlayedSeconds,
      updateLocalPlayedSeconds
    } = this.props;
    if (episode && this.player.current && isReady && isPlaying) {
      const { id, podcastId, playedSeconds } = episode;
      isLoggedIn
        ? updatePlayedSeconds({
            variables: { id, podcastId, playedSeconds }
          }).catch(err => console.log("Error in updatePlayedSeconds", err))
        : updateLocalPlayedSeconds({
            variables: { id, playedSeconds }
          }).catch(err =>
            console.log("Error in updateLocalPlayedSeconds", err)
          );
    }

    const that = this;
    this.updatePlayedSecondsTimeout = setTimeout(
      () => that.updatePlayedSeconds(),
      3000
    );
  }

  clearEpisode() {
    if (!this.state.episode) return;

    this.setState(
      {
        episode: null,
        isReady: false,
        duration: 0
      },
      () => {
        this.props.pause();
        this.player.current.src = null;
      }
    );
  }

  onEnded() {
    const { id, podcastId } = this.state.episode;
    this.clearEpisode();

    this.props.isLoggedIn
      ? this.onLoggedEnded(id, podcastId)
      : this.onLocalEnded(id);
  }

  onLoggedEnded(id, podcastId) {
    const { markAsPlayed, clearPlayingEpisode } = this.props;
    markAsPlayed({
      variables: { id, podcastId }
    });
    clearPlayingEpisode({
      refetchQueries: [{ query: getPlayingEpisode }, { query: getUpnext }]
    });
  }

  onLocalEnded(id) {
    const { markLocalAsPlayed, clearLocalPlayingEpisode } = this.props;
    markLocalAsPlayed({
      variables: { id }
    });
    clearLocalPlayingEpisode({
      refetchQueries: [
        { query: getLocalPlayingEpisode },
        { query: getLocalUpnext }
      ]
    });
  }

  onReady() {
    this.setState({ isReady: true, isLoading: false }, () => {
      this.setPlaybackRate(this.state.playbackRate);
      this.onPlay();
    });
  }

  onPlay() {
    if (this.state.isReady) {
      /* 
        To prevent crash in Edge and IE
        https://developers.google.com/web/updates/2016/03/play-returns-promise
     */
      const playPromise = this.player.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => this.props.play())
          .catch(() => console.log("autoplay blocked"));
      } else {
        this.props.play();
      }
    }
  }

  onPause() {
    this.props.pause();
    this.player.current.pause();
  }

  handlePlayPause() {
    if (!this.state.isPlaying) {
      this.onPlay();
    } else {
      this.onPause();
    }
  }

  increasePlaybackRate() {
    const { playbackRate, playbackStep, maxPlaybackRate } = this.state;
    //https://stackoverflow.com/questions/10473994/javascript-adding-decimal-numbers-issue#10474055
    const newRate = +(playbackRate + playbackStep).toFixed(1);
    if (newRate <= maxPlaybackRate) {
      this.setPlaybackRate(newRate);
    }
  }

  decreasePlaybackRate() {
    const { playbackRate, playbackStep, minPlaybackRate } = this.state;
    // https://stackoverflow.com/questions/10473994/javascript-adding-decimal-numbers-issue#10474055
    const newRate = +(playbackRate - playbackStep).toFixed(1);
    if (newRate >= minPlaybackRate) {
      this.setPlaybackRate(newRate);
    }
  }

  setDuration() {
    this.setState({ duration: this.player.current.duration });
    this.player.current.currentTime = this.state.episode.playedSeconds;
  }

  setPlaybackRate(playbackRate) {
    this.setState({ playbackRate }, () => {
      this.player.current.playbackRate = this.state.playbackRate;
    });
  }

  setTime(value) {
    this.setState(
      {
        episode: update(this.state.episode, {
          playedSeconds: { $set: +value.toFixed(2) }
        })
      },
      () => {
        this.player.current.currentTime = this.state.episode.playedSeconds;

        clearTimeout(this.updatePlayedSecondsTimeout);
        this.updatePlayedSeconds();
      }
    );
  }

  setVolume(volume) {
    const isMuted = volume <= 0;
    if (isMuted !== this.state.isMuted) {
      this.onMute(isMuted);
    } else {
      const newLastVolume = volume !== 0 ? volume : this.state.lastVolume;
      this.setState({ lastVolume: newLastVolume });
    }
    this.setState({ volume }, () => {
      this.player.current.volume = this.state.volume;
    });
  }

  onMute(isMuted) {
    if (isMuted) {
      this.setState({ isMuted: true, lastVolume: this.state.volume }, () => {
        this.setVolume(0);
      });
    } else {
      const volume = this.state.lastVolume > 0 ? this.state.lastVolume : 0.1;
      this.setState({ isMuted: false }, () => {
        this.setVolume(volume);
      });
    }
  }

  skipTime(amount) {
    const { episode, duration, isReady } = this.state;
    if (episode && this.player.current && isReady) {
      const newTime = +(episode.playedSeconds + amount).toFixed(2);
      if (newTime <= 0) {
        this.setTime(0);
      } else if (newTime >= duration) {
        this.onEnded();
      } else {
        this.setTime(newTime);
      }
    }
  }

  onProgressClick(e) {
    const offset = e.target.getBoundingClientRect();
    const pos = (e.pageX - offset.left) / offset.width;
    this.setTime(pos * this.state.duration);
  }

  handleMute() {
    this.onMute(!this.state.isMuted);
  }

  handleUpnextPopup() {
    this.setState({ isPopupOpen: !this.state.isPopupOpen });
  }

  handleEpisodeModal() {
    this.setState({ isModalOpen: !this.state.isModalOpen });
  }

  formatSeconds(seconds) {
    // fix 0 seconds text
    return moment.duration(seconds > 1 ? seconds : 1, "seconds").format();
  }

  render() {
    const {
      episode,
      isReady,
      isPlaying,
      isLoading,
      duration,
      playbackRate,
      volume,
      isMuted,
      isModalOpen,
      isPopupOpen
    } = this.state;
    return (
      <div className="player">
        <div className="player__controls-left">
          {episode ? (
            <Link
              className="player__link-to-podcast"
              to={`/podcasts/${episode.podcastId}`}
            >
              <img
                className="player__podcast-atrwork"
                src={episode.podcastArtworkUrl}
                alt=""
              />
            </Link>
          ) : null}
          <button
            onClick={() => this.skipTime(-15)}
            className="player__skip player__skip-back"
            disabled={!isReady}
          >
            <span className="player__skip-text">15</span>
          </button>
          <div onClick={() => this.handlePlayPause()}>
            {playButtonSvg(isPlaying)}
          </div>
          <button
            disabled={!isReady}
            onClick={() => this.skipTime(30)}
            className="player__skip player__skip-forward"
          >
            <span className="player__skip-text">30</span>
          </button>
        </div>

        <div className="player__controls-center">
          <div className="player__title">
            {episode ? (
              <span
                className="player__title-link"
                title={episode.title}
                onClick={() => this.handleEpisodeModal()}
              >
                {episode.title}
              </span>
            ) : (
              <span>Select episode to play</span>
            )}
          </div>
          <div className="player__author">
            {episode ? (
              <span>
                <Link to={`/podcasts/${episode.podcastId}`}>
                  {episode.author}
                </Link>{" "}
                - {moment(episode.pubDate).format("MMM D, YYYY")}
              </span>
            ) : (
              "-"
            )}
          </div>
          <div className="player__seek-bar">
            <progress
              className="seek-bar__progress"
              onClick={e => this.onProgressClick(e)}
              onChange={e => this.setTime(Number(e.target.value))}
              value={episode ? episode.playedSeconds : 0}
              min="0"
              max={duration}
            />
            <div className="seek-bar__time">
              <span className="seek-bar__text">
                {isReady && !isLoading
                  ? this.formatSeconds(episode.playedSeconds)
                  : "--/--"}
              </span>
              <span className="seek-bar__text">
                {isReady && !isLoading ? this.formatSeconds(duration) : "--/--"}
              </span>
            </div>
          </div>
        </div>
        <div className="player__controls-right">
          <div className="player__playback-rate">
            <div
              className="playback-rate__control"
              onClick={() => this.increasePlaybackRate()}
            >
              {playbackIncreaseSvg}
            </div>
            <div className="playback-rate__text">{playbackRate}x</div>
            <div
              className="playback-rate__control"
              onClick={() => this.decreasePlaybackRate()}
            >
              {playbackDecreaseSvg}
            </div>
          </div>
          <div
            className={
              isMuted
                ? "player__volume player__volume--muted"
                : "player__volume"
            }
          >
            <div onClick={() => this.handleMute()}>{volumeSvg}</div>
            <div className="volume__slider">
              <input
                className="volume__range"
                onChange={e => this.setVolume(Number(e.target.value))}
                value={volume}
                type="range"
                min="0"
                max="1"
                step="0.1"
              />
            </div>
          </div>
          <div
            className="player__up-next"
            onClick={() => this.handleUpnextPopup()}
          >
            {upnextSvg}
          </div>
        </div>

        {isPopupOpen ? (
          <UpnextPopup
            isModalOpen={isPopupOpen}
            handleUpnextPopup={this.handleUpnextPopup}
            onQueueItemClick={this.onQueueItemClick}
          />
        ) : null}

        {isModalOpen ? (
          <EpisodeModal
            isModalOpen={isModalOpen}
            handleEpisodeModal={this.handleEpisodeModal}
            podcastId={episode.podcastId}
            id={episode.id}
          />
        ) : null}

        <audio
          style={{ display: "none" }}
          ref={this.player}
          src={episode ? episode.mediaUrl : null}
          onLoadedMetadata={() => this.setDuration()}
          onCanPlay={() => this.onReady()}
          onEnded={() => this.onEnded()}
          onPlay={() => this.onPlay()}
          onPause={() => this.onPause()}
          muted={isMuted}
          preload="metadata"
          autoPlay={false}
        />
      </div>
    );
  }
}

AudioPlayer.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  playingEpisode: PropTypes.object,
  localPlayingEpisode: PropTypes.object,
  updatePlayedSeconds: PropTypes.func.isRequired,
  updateLocalPlayedSeconds: PropTypes.func.isRequired,
  markAsPlayed: PropTypes.func.isRequired,
  markLocalAsPlayed: PropTypes.func.isRequired,
  clearPlayingEpisode: PropTypes.func.isRequired,
  clearLocalPlayingEpisode: PropTypes.func.isRequired,
  play: PropTypes.func.isRequired,
  pause: PropTypes.func.isRequired
};

export default withTracker(() => {
  return { isLoggedIn: !!Meteor.userId() };
})(
  compose(
    graphql(isPLaying, {
      props: ({ data: { isPlaying } }) => ({
        isPlaying
      })
    }),
    graphql(getPlayingEpisode, {
      skip: props => !props.isLoggedIn,
      props: ({ data: { playingEpisode } }) => ({
        playingEpisode
      })
    }),
    graphql(getLocalPlayingEpisode, {
      skip: props => props.isLoggedIn,
      props: ({ data: { localPlayingEpisode } }) => ({
        localPlayingEpisode
      })
    }),
    graphql(updatePlayedSeconds, { name: "updatePlayedSeconds" }),
    graphql(markAsPlayed, { name: "markAsPlayed" }),
    graphql(clearPlayingEpisode, { name: "clearPlayingEpisode" }),
    graphql(clearLocalPlayingEpisode, { name: "clearLocalPlayingEpisode" }),
    graphql(updateLocalPlayedSeconds, { name: "updateLocalPlayedSeconds" }),
    graphql(markLocalAsPlayed, { name: "markLocalAsPlayed" }),
    graphql(play, { name: "play" }),
    graphql(pause, { name: "pause" })
  )(AudioPlayer)
);

function playButtonSvg(isPlaying) {
  return (
    <svg
      className={`player__play ${isPlaying ? "player__play--playing" : ""}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 250 250"
    >
      <g>
        <circle
          className="player__play-circle"
          cx="125"
          cy="125"
          r="115"
          fill="#fafafa"
        />
        <path d="M125 20A105 105 0 1 1 20 125 105.1 105.1 0 0 1 125 20m0-20A125 125 0 1 0 250 125 125 125 0 0 0 125 0Z" />

        <g className="play__inner">
          <g className="player__play-bars">
            <rect x="92.5" y="87.5" width="15" height="75" fill="#fafafa" />
            <polygon points="117.5 77.5 82.5 77.5 82.5 172.5 117.5 172.5 117.5 77.5 117.5 77.5" />
            <rect x="142.5" y="87.5" width="15" height="75" fill="#fafafa" />
            <polygon points="167.5 77.5 132.5 77.5 132.5 172.5 167.5 172.5 167.5 77.5 167.5 77.5" />
          </g>
          <path
            className="player__play-triangle"
            d="M183.3 125 95.9 175.5V74.6Z"
          />
        </g>
      </g>
    </svg>
  );
}

const playbackIncreaseSvg = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="playback-rate__button"
    viewBox="0 0 250 250"
  >
    <g>
      <path d="M125 0A125 125 0 1 0 250 125 125 125 0 0 0 125 0Zm75 138H137.5v62.5h-25V138H50V113h62.5V50.5h25V113H200Z" />
    </g>
  </svg>
);

const playbackDecreaseSvg = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="playback-rate__button"
    viewBox="0 0 250 250"
  >
    <g>
      <path d="M125 0A125 125 0 1 0 250 125 125 125 0 0 0 125 0Zm75 137H50V112H200Z" />
    </g>
  </svg>
);

const volumeSvg = (
  <svg
    className="volume__icon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 555.17 442.85"
  >
    <g className="volume__megaphone">
      <polygon points="145.86 320.5 0.5 320.5 0.5 121.5 147.1 121.5 323.5 0.95 323.5 441.9 145.86 320.5" />
      <path d="M323,1.89V441L146.27,320.17,146,320H1V122H147.26l.25-.17L323,1.89M324,0,147,121H0V321H145.7L324,442.85V0Z" />
    </g>
    <g className="volume__cross">
      <polygon points="459 251.41 393.95 316.46 363.54 286.05 428.59 221 363.54 155.95 393.95 125.54 459 190.59 524.05 125.54 554.46 155.95 489.41 221 554.46 286.05 524.05 316.46 459 251.41" />
      <path d="M394,126.25l64.34,64.34.71.71.71-.71,64.34-64.34,29.7,29.7-64.34,64.34-.71.71.71.71,64.34,64.34-29.7,29.7-64.34-64.34-.71-.71-.71.71L394,315.75l-29.7-29.7,64.34-64.34.71-.71-.71-.71L364.25,156l29.7-29.7m130.1-1.42-65,65.06L394,124.83,362.83,156,427.89,221l-65.06,65.05L394,317.17,459,252.11l65,65.06,31.12-31.12L490.11,221,555.17,156l-31.12-31.12Z" />
    </g>
  </svg>
);

const upnextSvg = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="up-next__icon"
    viewBox="0 0 251.5 192"
  >
    <g>
      <path d="M225 121H25A25.1 25.1 0 0 1 0 96H0A25.1 25.1 0 0 1 25 71H225a25.1 25.1 0 0 1 25 25h0A25.1 25.1 0 0 1 225 121Zm25.5 46h0a25.1 25.1 0 0 0-25-25H25.5a25.1 25.1 0 0 0-25 25h0a25.1 25.1 0 0 0 25 25h200A25.1 25.1 0 0 0 250.5 167Zm1-142h0a25.1 25.1 0 0 0-25-25H26.5a25.1 25.1 0 0 0-25 25h0a25.1 25.1 0 0 0 25 25h200A25.1 25.1 0 0 0 251.5 25Z" />
    </g>
  </svg>
);
