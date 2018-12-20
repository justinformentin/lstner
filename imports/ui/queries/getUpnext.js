import gql from "graphql-tag";

export default gql`
  query Upnext {
    upnext {
      id
      podcastId
      podcastArtworkUrl
      title
      author
    }
  }
`;
