import gql from "graphql-tag";

export default gql`
  mutation MarkLocalAsUnplayed($id: String!) {
    markLocalAsUnplayed(id: $id) @client
  }
`;
