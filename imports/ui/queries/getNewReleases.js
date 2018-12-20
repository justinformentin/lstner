import gql from "graphql-tag";

export default gql`
  query newReleases {
    newReleases {
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
