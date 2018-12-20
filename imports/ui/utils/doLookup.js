import axios from "axios";

export default term => {
  return axios
    .get(
      `https://itunes.apple.com/search?term=${encodeURIComponent(
        term
      )}&entity=podcast&limit=20`
    )
    .then(res => {
      const { resultCount, results } = res.data;
      if (resultCount === 0) {
        return null;
      }
      return results.map(preview => parseItunesPreview(preview));
    })
    .catch(err => console.log("Error in doLookup", err));
};

function parseItunesPreview(data) {
  return {
    podcastId: data.collectionId,
    feedUrl: data.feedUrl,
    title: data.trackName,
    author: data.artistName,
    artworkUrl: data.artworkUrl600 || data.artworkUrl100
  };
}
