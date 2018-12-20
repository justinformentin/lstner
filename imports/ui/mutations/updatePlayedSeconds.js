import gql from "graphql-tag";

export default gql`
  mutation UpdatePlayedSeconds(
    $id: String!
    $podcastId: Int!
    $playedSeconds: Float!
  ) {
    updatePlayedSeconds(
      id: $id
      podcastId: $podcastId
      playedSeconds: $playedSeconds
    ) {
      id
      podcastId
      playedSeconds
    }
  }
`;
