import gql from "graphql-tag";

export default gql`
  mutation RemoveFromUpnext($id: String!, $podcastId: Int!) {
    removeFromUpnext(id: $id, podcastId: $podcastId) {
      id
      podcastId
      inUpnext
    }
  }
`;
