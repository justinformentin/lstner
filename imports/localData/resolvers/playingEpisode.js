import { remove, find } from "lodash";

import getLocalPlayingEpisodeQuery from "../queries/getLocalPlayingEpisode";
import getLocalUpnextQuery from "../queries/getLocalUpnext";
import getLocalInProgressQuery from "../queries/getLocalInProgress";

export default (resolvers = {
  Query: {
    localPlayingEpisode(_, __, { cache }) {
      const prevEpisode = getLocalPlayingEpisode(cache);

      if (!prevEpisode) {
        const prevUpnext = getLocalUpnext(cache);

        if (prevUpnext && prevUpnext.length) {
          const episode = prevUpnext.shift();

          const upnextData = {
            localUpnext: prevUpnext
          };

          const episodeData = {
            localPlayingEpisode: episode
          };

          setLocalPlayingEpisode(cache, episodeData);
          setLocalUpnext(cache, upnextData);

          return episode;
        }

        return null;
      }

      return prevEpisode;
    },
    localUpnext(_, __, { cache }) {
      return getLocalUpnext(cache);
    }
  },
  Mutation: {
    updateLocalPlayedSeconds(_, { id, playedSeconds }, { cache }) {
      const prevInProgress = getLocalInProgress(cache);

      remove(prevInProgress, n => n.id === id);
      prevInProgress.push({ id, playedSeconds, __typename: "ids" });

      data = {
        localInProgress: [...prevInProgress]
      };

      setLocalInProgress(cache, data);

      return { __typename: "Episode", id, playedSeconds };
    },
    async setLocalPlayingEpisode(_, { id, podcastId }, { cache }) {
      let episodeData;
      let upnextData;
      const episode = await getEpisodeFromServer(id, podcastId);

      const prevEpisode = getLocalPlayingEpisode(cache);
      const playedSeconds = getPlayedSeconds(cache, id);

      episodeData = {
        localPlayingEpisode: {
          ...episode,
          playedSeconds: playedSeconds,
          __typename: "Episode"
        }
      };

      if (prevEpisode) {
        const prevUpnext = getLocalUpnext(cache);

        remove(prevUpnext, n => n.id === prevEpisode.id || n.id === id);
        prevUpnext.unshift(prevEpisode);

        upnextData = {
          localUpnext: prevUpnext
        };

        setLocalUpnext(cache, upnextData);
      }

      setLocalPlayingEpisode(cache, episodeData);
      setFieldValue(cache, id, "isPlayed", false);
      return null;
    },
    clearLocalPlayingEpisode(_, __, { cache }) {
      const data = {
        localPlayingEpisode: null
      };

      setLocalPlayingEpisode(cache, data);

      return null;
    },
    markLocalAsPlayed(_, { id }, { cache }) {
      const prevInProgress = getLocalInProgress(cache);

      remove(prevInProgress, n => n.id === id);
      inProgressData = {
        localInProgress: [...prevInProgress]
      };

      setFieldValue(cache, id, "isPlayed", true);
      setFieldValue(cache, id, "inUpnext", false);
      setLocalInProgress(cache, inProgressData);

      return null;
    },
    markLocalAsUnplayed(_, { id }, { cache }) {
      setFieldValue(cache, id, "isPlayed", false);

      return null;
    },
    async addToLocalUpnext(_, { id, podcastId }, { cache }) {
      const prevUpnext = getLocalUpnext(cache);
      const episode = await getEpisodeFromServer(id, podcastId);
      const playedSeconds = getPlayedSeconds(cache, id);

      episodeData = {
        ...episode,
        playedSeconds: playedSeconds,
        __typename: "Episode"
      };

      remove(prevUpnext, n => n.id === id);
      prevUpnext.push(episodeData);

      const data = {
        localUpnext: prevUpnext
      };

      setFieldValue(cache, id, "inUpnext", true);
      setLocalUpnext(cache, data);

      return null;
    },
    removeFromLocalUpnext(_, { id }, { cache }) {
      const prevUpnext = getLocalUpnext(cache);
      remove(prevUpnext, n => n.id === id);

      const data = {
        localUpnext: prevUpnext
      };

      setLocalUpnext(cache, data);
      setFieldValue(cache, id, "inUpnext", false);

      return null;
    }
  }
});

function getEpisodeFromServer(id, podcastId) {
  return Meteor.callPromise("getEpisode", id, podcastId)
    .then(res => res)
    .catch(error => console.log("error in Meteor.callPromise", error));
}

function getLocalPlayingEpisode(cache) {
  return cache.readQuery({ query: getLocalPlayingEpisodeQuery })
    .localPlayingEpisode;
}

function setLocalPlayingEpisode(cache, data) {
  cache.writeQuery({ query: getLocalPlayingEpisodeQuery, data });
}

function getLocalUpnext(cache) {
  return cache.readQuery({ query: getLocalUpnextQuery }).localUpnext;
}

function setLocalUpnext(cache, data) {
  cache.writeQuery({ query: getLocalUpnextQuery, data });
}

function getLocalInProgress(cache) {
  return cache.readQuery({ query: getLocalInProgressQuery }).localInProgress;
}

function setLocalInProgress(cache, data) {
  cache.writeQuery({ query: getLocalInProgressQuery, data });
}

function getPlayedSeconds(cache, id) {
  const inProgress = getLocalInProgress(cache);
  return find(inProgress, { id }) ? find(inProgress, { id }).playedSeconds : 0;
}

function getObjectById(cache, id) {
  return cache.data.data[id];
}

function setObjectData(cache, data) {
  cache.writeData({ data });
}

function setFieldValue(cache, id, field, value) {
  const episode = getObjectById(cache, id);
  const episodeData = {
    [id]: {
      ...episode,
      [field]: value
    }
  };
  setObjectData(cache, episodeData);
}
