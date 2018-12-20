import gql from "graphql-tag";

export default gql`
  mutation UpdateLocalPlayedSeconds($id: String!, $playedSeconds: Float!) {
    updateLocalPlayedSeconds(id: $id, playedSeconds: $playedSeconds) @client {
      id
      playedSeconds
    }
  }
`;
