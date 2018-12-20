import gql from "graphql-tag";

export default gql`
  mutation RemoveFromLocalUpnext($id: String!, $podcastId: Int!) {
    removeFromLocalUpnext(id: $id, podcastId: $podcastId) @client
  }
`;
