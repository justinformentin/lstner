import gql from "graphql-tag";

export default gql`
  mutation Pause {
    pause @client
  }
`;
