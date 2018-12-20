import gql from "graphql-tag";

export default gql`
  mutation SetPlayingEpisode($id: String!, $podcastId: Int!) {
    setPlayingEpisode(id: $id, podcastId: $podcastId) {
      id
      podcastId
      isPlayed
      inUpnext
    }
  }
`;
