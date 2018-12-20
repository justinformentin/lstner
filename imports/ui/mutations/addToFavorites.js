import gql from "graphql-tag";

export default gql`
  mutation AddToFavorites($id: String!, $podcastId: Int!) {
    addToFavorites(id: $id, podcastId: $podcastId) {
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
