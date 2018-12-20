import gql from "graphql-tag";

export default gql`
  query IsPlaying {
    isPlaying @client
  }
`;
