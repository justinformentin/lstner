import gql from "graphql-tag";

export default gql`
  query LocalPlayingEpisode {
    localPlayingEpisode @client {
      id
      podcastId
      podcastArtworkUrl
      title
      mediaUrl
      pubDate
      playedSeconds
      author
    }
  }
`;
