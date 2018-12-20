import gql from "graphql-tag";

export default gql`
  mutation unsubscribe($podcastId: Int!) {
    unsubscribe(podcastId: $podcastId) {
      podcastId
      subscribed
    }
  }
`;
