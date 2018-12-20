import axios from "axios";

export default {
  Query: {
    podcastsPreviews(obj, { genreId }) {
      return axios(
        `https://itunes.apple.com/us/rss/topaudiopodcasts/limit=200/genre=${genreId}/json`
      )
        .then(res => res.data.feed.entry)
        .then(res => getPreviews(res));
    }
  }
};

function getPreviews(data) {
  return data.map(el => {
    return {
      id: getId(el),
      title: getTitle(el),
      summary: getSummary(el),
      artwork: getArtwork(el)
    };
  });
}

function getId(data) {
  return data["id"].attributes["im:id"];
}

function getTitle(data) {
  return data["im:name"].label;
}

function getArtwork(data) {
  return data["im:image"][data["im:image"].length - 1].label;
}

function getSummary(data) {
  return data["summary"] ? data["summary"].label : null;
}
