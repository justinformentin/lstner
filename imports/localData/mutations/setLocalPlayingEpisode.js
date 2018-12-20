import gql from "graphql-tag";

export default gql`
  mutation SetLocalPlayingEpisode($id: String!, $podcastId: Int!) {
    setLocalPlayingEpisode(id: $id, podcastId: $podcastId) @client
  }
`;
