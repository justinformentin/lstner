import gql from "graphql-tag";

export default gql`
  mutation MarkAsUnplayed($id: String!, $podcastId: Int!) {
    markAsUnplayed(id: $id, podcastId: $podcastId) {
      id
      podcastId
      isPlayed
    }
  }
`;
