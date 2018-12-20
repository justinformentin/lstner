import gql from "graphql-tag";

export default gql`
  mutation MarkLocalAsPlayed($id: String!) {
    markLocalAsPlayed(id: $id) @client
  }
`;
