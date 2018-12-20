import gql from "graphql-tag";

export default gql`
  query Favorites {
    favorites {
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
