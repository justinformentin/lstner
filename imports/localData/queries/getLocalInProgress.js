import gql from "graphql-tag";

export default gql`
  query LocalInProgress {
    localInProgress @client {
      id
      playedSeconds
    }
  }
`;
