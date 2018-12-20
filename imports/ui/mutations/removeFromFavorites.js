import gql from "graphql-tag";

export default gql`
  mutation RemoveFromFavorites($id: String!, $podcastId: Int!) {
    removeFromFavorites(id: $id, podcastId: $podcastId) {
      id
      podcastId
      inFavorites
    }
  }
`;
