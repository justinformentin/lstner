import gql from "graphql-tag";

export default gql`
  mutation Play {
    play @client
  }
`;
