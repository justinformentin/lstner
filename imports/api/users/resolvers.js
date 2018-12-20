export default {
  Query: {
    user(_, __, { user }) {
      return user || {};
    }
  },
  User: {
    email: user => user.emails[0].address
  }
};
