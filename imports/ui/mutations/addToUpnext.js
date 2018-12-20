import gql from "graphql-tag";

export default gql`
  mutation AddToUpnext($id: String!, $podcastId: Int!) {
    addToUpnext(id: $id, podcastId: $podcastId) {
      id
      podcastId
      podcastArtworkUrl
      title
      author
      inUpnext
    }
  }
`;
