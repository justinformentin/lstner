import isPlayingQuery from "../queries/isPlaying";

export default {
  Query: {
    isPlaying(_, __, { cache }) {
      return getIsPlaying(cache);
    }
  },
  Mutation: {
    pause(_, __, { cache }) {
      setIsPlaying(cache, false);

      return null;
    },
    play(_, __, { cache }) {
      setIsPlaying(cache, true);

      return null;
    }
  }
};

function getIsPlaying(cache) {
  return cache.readQuery({ query: isPlayingQuery }).isPlaying;
}

function setIsPlaying(cache, value) {
  const data = {
    isPlaying: value
  };

  cache.writeData({ data });
}
