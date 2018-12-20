import gql from "graphql-tag";

export default gql`
  mutation MarkAsPlayed($id: String!, $podcastId: Int!) {
    markAsPlayed(id: $id, podcastId: $podcastId) {
      id
      podcastId
      isPlayed
    }
  }
`;
