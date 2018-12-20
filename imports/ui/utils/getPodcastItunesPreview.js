import { Mongo } from "meteor/mongo";
import axios from "axios";

const ItunesPreviews = new Mongo.Collection("itunesPreviews");

export default podcastId => {
  const itunesPreview = ItunesPreviews.findOne({ podcastId });
  if (!itunesPreview) {
    return fetchItunesPreview(podcastId).then(async itunesPreview => {
      if (itunesPreview) {
        await ItunesPreviews.insert(itunesPreview);
        return itunesPreview;
      }
    });
  }
  return itunesPreview;
};

function fetchItunesPreview(podcastId) {
  return axios
    .get(`https://itunes.apple.com/lookup?id=${podcastId}`)
    .then(res => {
      const { resultCount, results } = res.data;
      if (resultCount === 0) {
        return null;
      }
      return parseItunesPreview(results[0]);
    })
    .catch(err => console.log(err));
}

function parseItunesPreview(data) {
  return {
    podcastId: data.collectionId,
    feedUrl: data.feedUrl,
    title: data.trackName,
    author: data.artistName,
    artworkUrl: data.artworkUrl600 || data.artworkUrl100
  };
}
