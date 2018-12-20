import Podcasts from "../podcasts/podcasts";
import UsersData from "../usersData/usersData";
import moment from "moment";

export default {
  Query: {
    feed(_, { podcastId, limit }) {
      return getEpisodes(podcastId)
        .slice(0, limit)
        .sort(sortByDate);
    },
    episode(_, { id, podcastId }) {
      return getEpisodes(podcastId).find(el => el.id === id);
    }
  },
  Episode: {
    podcastId: data => data.podcastId,
    podcastArtworkUrl: data => data.podcastArtworkUrl,
    title: data => data.title,
    description: data => data.description,
    author: data => data.author,
    mediaUrl: data => data.mediaUrl,
    playedSeconds: (data, _, { user }) => {
      if (!user) return 0;
      const { _id } = user;
      const userData = UsersData.findOne({ _id });
      if (!userData || !userData.inProgress) return 0;
      const episodeData = userData.inProgress.find(el => el.id === data.id);
      return episodeData ? episodeData.playedSeconds : 0;
    },
    duration: data => data.duration,
    pubDate: data => data.pubDate,
    linkToEpisode: data => data.linkToEpisode,
    inFavorites: (data, _, { user }) => inUserData(user, data.id, "favorites"),
    inUpnext: (data, _, { user }) => inUserData(user, data.id, "upnext"),
    isPlayed: (data, _, { user }) => inUserData(user, data.id, "played")
  }
};

function inUserData(user, id, field) {
  if (!user) return false;
  const { _id } = user;
  const userData = UsersData.findOne({ _id });
  if (!userData || !userData[field]) return false;

  return !!userData[field].find(el => el.id === id);
}

function sortByDate(a, b) {
  return moment(b.pubDate).valueOf() - moment(a.pubDate).valueOf();
}

function getEpisodes(podcastId) {
  const podcast = Podcasts.findOne({ podcastId });
  if (podcast.episodes) {
    return podcast.episodes;
  }
}
