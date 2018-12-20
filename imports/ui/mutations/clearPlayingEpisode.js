import gql from "graphql-tag";

export default gql`
  mutation ClearEpisode {
    clearPlayingEpisode {
      podcastId
      id
    }
  }
`;
