import moment from "moment";
import { find } from "lodash";

import UsersData from "./usersData";
import Podcasts from "../podcasts/podcasts";

export default {
  Query: {
    podcasts(_, __, { user }) {
      if (!user) return null;
      const podcasts = getUserData(user._id, "podcasts");

      if (!podcasts || !podcasts.length) return null;

      return podcasts.map(podcastId => {
        return Podcasts.findOne({ podcastId });
      });
    },
    playingEpisode(_, __, { user }) {
      if (!user) return null;
      const { _id } = user;
      const playingEpisode = getUserData(_id, "playingEpisode");

      if (!playingEpisode) {
        const upnext = getUserData(_id, "upnext");
        if (!upnext || !upnext.length) return null;
        const { id, podcastId } = upnext[0];
        UsersData.update(
          { _id },
          {
            $set: { playingEpisode: { id, podcastId } },
            $pull: { upnext: { id } }
          }
        );
        return getEpisode(id, podcastId);
      }

      const { id, podcastId } = playingEpisode;

      return getEpisode(id, podcastId);
    },
    newReleases(_, __, { user }) {
      if (!user) return null;
      const podcasts = getUserData(user._id, "podcasts");
      const played = getUserData(user._id, "played");

      if (!podcasts || !podcasts.length) return null;

      let result = [];

      podcasts.forEach(podcast => {
        const podcastData = Podcasts.findOne({ podcastId: podcast });
        if (podcastData.episodes) {
          const newEpisodes = podcastData.episodes.filter(episode => {
            if (episode)
              return (
                validForNewReleases(episode.pubDate) &&
                !isPlayed(played, episode.id)
              );
          });
          Array.prototype.push.apply(result, newEpisodes);
        }
      });

      return result ? result.sort(sortByDate) : result;
    },
    upnext(_, __, { user }) {
      if (!user) return null;
      const upnext = getUserData(user._id, "upnext");

      return getFeed(upnext);
    },
    inProgress(_, __, { user }) {
      if (!user) return null;
      const inProgress = getUserData(user._id, "inProgress");
      const feed = getFeed(inProgress);
      return feed ? feed.sort(sortByDate) : feed;
    },
    favorites(_, __, { user }) {
      if (!user) return null;
      const favorites = getUserData(user._id, "favorites");
      const feed = getFeed(favorites);
      return feed ? feed.sort(sortByDate) : feed;
    },
    played(_, __, { user }) {
      if (!user) return null;
      const played = getUserData(user._id, "played");

      return getFeed(played);
    }
  },
  Mutation: {
    subscribe(_, { podcastId }, { user }) {
      if (!user) return null;
      const { _id } = user;
      UsersData.update(
        { _id },
        { $addToSet: { podcasts: podcastId } },
        { upsert: true }
      );
      return Podcasts.findOne({ podcastId });
    },
    unsubscribe(_, { podcastId }, { user }) {
      if (!user) return null;
      const { _id } = user;
      UsersData.update({ _id }, { $pull: { podcasts: podcastId } });
      return Podcasts.findOne({ podcastId });
    },
    clearPlayingEpisode(_, __, { user }) {
      if (!user) return null;
      const { _id } = user;
      UsersData.update({ _id }, { $set: { playingEpisode: null } });
      return null;
    },
    setPlayingEpisode(_, { id, podcastId }, { user }) {
      if (!user) return null;
      const { _id } = user;
      const userData = UsersData.findOne({ _id });

      if (userData && userData.playingEpisode) {
        UsersData.update({ _id }, { $pull: { upnext: { id } } });
        UsersData.update(
          { _id },
          {
            $push: {
              upnext: { $each: [userData.playingEpisode], $position: 0 }
            }
          }
        );
      }
      UsersData.update(
        { _id, "inProgress.id": { $ne: id } },
        { $push: { inProgress: { id, podcastId, playedSeconds: 0 } } }
      );

      UsersData.update(
        { _id },
        {
          $set: { playingEpisode: { id, podcastId } },
          $pull: { played: { id } }
        },
        { upsert: true }
      );
      return getEpisode(id, podcastId);
    },
    updatePlayedSeconds(_, { id, podcastId, playedSeconds }, { user }) {
      if (!user) return null;
      const { _id } = user;
      //https://stackoverflow.com/questions/37427610/mongodb-update-or-insert-object-in-array#37428056
      UsersData.update(
        { _id },
        {
          $pull: { inProgress: { id } }
        }
      );
      UsersData.update(
        { _id },
        { $push: { inProgress: { id, podcastId, playedSeconds } } }
      );
      return { id, podcastId, playedSeconds };
    },
    addToUpnext(_, { id, podcastId }, { user }) {
      if (!user) return null;
      const { _id } = user;

      UsersData.update(
        { _id },
        { $addToSet: { upnext: { id, podcastId } } },
        { upsert: true }
      );
      return getEpisode(id, podcastId);
    },
    removeFromUpnext(_, { id, podcastId }, { user }) {
      if (!user) return null;
      const { _id } = user;
      const userData = UsersData.findOne({ _id });

      if (userData) {
        UsersData.update({ _id }, { $pull: { upnext: { id } } });
      }
      return getEpisode(id, podcastId);
    },
    addToFavorites(_, { id, podcastId }, { user }) {
      if (!user) return null;
      const { _id } = user;

      UsersData.update(
        { _id },
        { $addToSet: { favorites: { id, podcastId } } },
        { upsert: true }
      );
      return getEpisode(id, podcastId);
    },
    removeFromFavorites(_, { id, podcastId }, { user }) {
      if (!user) return null;
      const { _id } = user;
      const userData = UsersData.findOne({ _id });

      if (userData) {
        UsersData.update({ _id }, { $pull: { favorites: { id } } });
      }
      return getEpisode(id, podcastId);
    },
    markAsPlayed(_, { id, podcastId }, { user }) {
      if (!user) return null;
      const { _id } = user;

      UsersData.update(
        { _id },
        {
          $pull: { inProgress: { id } },
          $addToSet: { played: { id, podcastId } }
        },
        { upsert: true }
      );
      return getEpisode(id, podcastId);
    },
    markAsUnplayed(_, { id, podcastId }, { user }) {
      if (!user) return null;
      const { _id } = user;
      const userData = UsersData.findOne({ _id });

      if (userData) {
        UsersData.update({ _id }, { $pull: { played: { id } } });
      }
      return getEpisode(id, podcastId);
    }
  }
};

function getUserData(_id, field) {
  const userData = UsersData.findOne({ _id });
  if (!userData || !userData[field]) return null;
  return userData[field];
}

function getEpisode(id, podcastId) {
  const podcast = Podcasts.findOne({ podcastId });
  if (podcast.episodes && podcast.episodes.length) {
    return find(podcast.episodes, { id });
  }
  return null;
}

function getFeed(feed) {
  return !feed || !feed.length
    ? null
    : feed.map(({ id, podcastId }) => getEpisode(id, podcastId));
}

function sortByDate(a, b) {
  return moment(b.pubDate).valueOf() - moment(a.pubDate).valueOf();
}

function validForNewReleases(date) {
  if (moment(date).isValid()) {
    return moment(moment().valueOf()).diff(date, "days") <= 14;
  }
  return false;
}

function isPlayed(played, id) {
  return played ? find(played, { id }) : false;
}
