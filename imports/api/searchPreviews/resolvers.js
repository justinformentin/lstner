import doLookup from "../../ui/utils/doLookup";

export default {
  Query: {
    searchPreviews(_, { searchTerm }) {
      return doLookup(searchTerm);
    }
  }
};
