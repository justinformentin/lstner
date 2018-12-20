import gql from "graphql-tag";

export default gql`
  query SearchPreviews($searchTerm: String!) {
    searchPreviews(searchTerm: $searchTerm) {
      podcastId
      title
      author
      artworkUrl
    }
  }
`;
