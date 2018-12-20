import gql from "graphql-tag";

export default gql`
  query Podcasts {
    podcasts {
      podcastId
      artworkUrl
    }
  }
`;
