import getLoggedUser from "../../ui/queries/getLoggedUser";

export default [
  {
    request: { query: getLoggedUser },
    result: {
      data: {
        user: {
          __typename: "User",
          email: "qwerty@live.com",
          _id: "5FRMNMEAAKK2wyXtE"
        }
      }
    }
  }
];
