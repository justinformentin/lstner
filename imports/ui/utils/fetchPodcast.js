import { Mongo } from "meteor/mongo";
const { ObjectID } = Mongo;

import axios from "axios";
import X2JS from "x2js";
import moment from "moment";
import getPodcastItunesPreview from "./getPodcastItunesPreview";

export default async podcastId => {
  return await getData(podcastId);
};

async function getData(podcastId) {
  const itunesPreview = await getPodcastItunesPreview(podcastId);
  if (!itunesPreview) {
    return null;
  }

  const json = await parseFeed(itunesPreview.feedUrl);

  return {
    ...itunesPreview,
    website: getWebsite(json),
    description: getDescription(json),
    summary: getSummary(json),
    episodes: getEpisodes(
      json,
      itunesPreview.podcastId,
      itunesPreview.artworkUrl
    )
  };
}

function parseFeed(feedUrl) {
  return axios(feedUrl)
    .then(res => xml2json(res.data))
    .then(res => res.rss.channel)
    .catch(err => console.log("Error in parseFeed", err));
}

function xml2json(xml) {
  const x2js = new X2JS();
  return x2js.xml2js(xml);
}

function getAuthor(data) {
  return data.author.toString();
}

function getWebsite(data) {
  return getStringfromArray(data.link);
}

function getDescription(data) {
  if (data.description) return getStringfromArray(data.description);
}

function getSummary(data) {
  if (data.summary) return data.summary.toString();
}

function getEpisodes(data, podcastId, podcastArtworkUrl) {
  const { item } = data;
  if (!item) return null;

  const episodes = Array.isArray(item) ? item : [item];
  const result = [];
  episodes.forEach(episode => {
    try {
      result.push({
        id: new ObjectID().valueOf(),
        podcastId,
        podcastArtworkUrl,
        title: getStringfromArray(episode.title),
        description: getDescription(episode),
        author: getAuthor(data),
        mediaUrl: getMediaUrl(episode),
        duration: getDuration(episode),
        pubDate: getPubDate(episode),
        pubDateUnix: getPubDateUnix(episode),
        linkToEpisode: getLinkToEpisode(episode)
      });
    } catch (error) {
      console.log("error", error);
      console.log("error in episode", episode);
      return;
    }
  });
  return result;
}

function getMediaUrl(data) {
  return data.enclosure["_url"];
}

function getDuration(data) {
  if (!data.duration) return null;
  const duration = data.duration.toString();
  const index = duration.indexOf(":");

  return index === -1 ? parseInt(duration) : toSeconds(duration);
}

function toSeconds(time) {
  let p = time.split(":"),
    s = 0,
    m = 1;

  while (p.length > 0) {
    s += m * parseInt(p.pop(), 10);
    m *= 60;
  }

  return s;
}

function getPubDate(data) {
  return data.pubDate;
}

function getPubDateUnix(data) {
  return moment(data.pubDate).unix();
}

function getLinkToEpisode(data) {
  return data.link;
}

/*
"title": [
  "SYSK Selects: Was there a real King Arthur?",
  {
      "__prefix": "itunes",
      "__text": "SYSK Selects: Was there a real King Arthur?"
  }
]*/
function getStringfromArray(array) {
  if (typeof array === "string") return array;
  if (Array.isArray(array)) {
    const res = array.filter(el => {
      if (typeof el === "string") return el;
    });

    return res.length > 1 ? res[0] : res.toString();
  }
}
