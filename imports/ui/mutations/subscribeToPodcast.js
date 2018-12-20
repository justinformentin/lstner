import gql from "graphql-tag";

export default gql`
  mutation subscribe($podcastId: Int!) {
    subscribe(podcastId: $podcastId) {
      podcastId
      artworkUrl
      subscribed
    }
  }
`;
