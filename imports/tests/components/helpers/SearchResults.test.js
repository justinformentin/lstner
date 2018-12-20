import React from "react";
import { shallow } from "enzyme";

import { SearchResults } from "../../../ui/components/helpers/SearchResults";
import searchResultsMocks from "../../fixtures/searchResultsMocks";

test("should render SearchResults without errors", () => {
  const wrapper = shallow(<SearchResults />);
  expect(wrapper).toMatchSnapshot();
});

test("should show Loader if loading is true", () => {
  const wrapper = shallow(<SearchResults loading={true} />);
  expect(wrapper).toMatchSnapshot();
});

test("should show error message if error", () => {
  const wrapper = shallow(<SearchResults error={{ error: "error text" }} />);
  expect(wrapper).toMatchSnapshot();
});

test("should show error message if searchPreviews is empty", () => {
  const wrapper = shallow(<SearchResults searchPreviews={[]} />);
  expect(wrapper).toMatchSnapshot();
});

test("should render episode information", () => {
  const wrapper = shallow(
    <SearchResults searchPreviews={searchResultsMocks} />
  );
  expect(wrapper).toMatchSnapshot();
});
