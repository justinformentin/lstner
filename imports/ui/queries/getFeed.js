import gql from "graphql-tag";

export default gql`
  query Feed($podcastId: Int!, $limit: Int!) {
    podcast(podcastId: $podcastId) {
      updatedAt
    }

    feed(podcastId: $podcastId, limit: $limit) {
      id
      podcastId
      title
      pubDate
      duration
      inFavorites
      inUpnext
      isPlayed
    }
  }
`;
