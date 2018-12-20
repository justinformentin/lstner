import gql from "graphql-tag";

export default gql`
  query genres {
    genres {
      id
      name
      subgenres {
        id
        name
      }
    }
  }
`;
