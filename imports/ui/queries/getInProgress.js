import gql from "graphql-tag";

export default gql`
  query InProgress {
    inProgress {
      id
      podcastId
      podcastArtworkUrl
      duration
      title
      author
      pubDate
      isPlayed
      inUpnext
      inFavorites
    }
  }
`;
