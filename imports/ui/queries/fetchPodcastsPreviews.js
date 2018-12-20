import gql from "graphql-tag";

export default gql`
  query PodcastsPreviews($genreId: Int!) {
    podcastsPreviews(genreId: $genreId) {
      id
      title
      artwork
      summary
    }
  }
`;
