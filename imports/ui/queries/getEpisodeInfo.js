import gql from "graphql-tag";

export default gql`
  query Episode($id: String!, $podcastId: Int!) {
    episode(id: $id, podcastId: $podcastId) {
      title
      description
      author
      duration
      pubDate
      linkToEpisode
    }
  }
`;
