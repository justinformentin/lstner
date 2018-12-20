import gql from "graphql-tag";

export default gql`
  mutation AddToLocalUpnext($id: String!, $podcastId: Int!) {
    addToLocalUpnext(id: $id, podcastId: $podcastId) @client
  }
`;
