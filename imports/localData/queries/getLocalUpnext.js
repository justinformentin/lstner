import gql from "graphql-tag";

export default gql`
  query LocalUpnext {
    localUpnext @client {
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
