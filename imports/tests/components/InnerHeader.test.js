jest.mock("meteor/session");
import { Session } from "meteor/session";

import React from "react";
import { shallow } from "enzyme";
import { InnerHeader } from "../../ui/components/InnerHeader";
import SearchPopup from "../../ui/components/helpers/SearchPopup";

const title = "Test title for InnerHeader component";

test("should render InnerHeader with title", () => {
  const wrapper = shallow(
    <InnerHeader title={title} isSearchModelOpen={false} />
  );
  expect(wrapper).toMatchSnapshot();
});

test("should render InnerHeader without title if not provided", () => {
  const wrapper = shallow(<InnerHeader isSearchModelOpen={false} />);
  expect(wrapper).toMatchSnapshot();
});

test("should not render SearchPopup if isSearchModelOpen value if false ", () => {
  const wrapper = shallow(<InnerHeader isSearchModelOpen={false} />);
  expect(wrapper.find(SearchPopup).length).toEqual(0);
});

test("should set Session key isSearchModelOpen to true on openSearchModal() run", () => {
  const wrapper = shallow(<InnerHeader isSearchModelOpen={false} />);
  expect(Session.get("isSearchModelOpen")).toBeFalsy();

  wrapper.find(".inner-header__search-btn").simulate("click");
  expect(Session.get("isSearchModelOpen")).toBe(true);
});

test("should render SearchPopup if isSearchModelOpen value if true ", () => {
  const wrapper = shallow(<InnerHeader isSearchModelOpen={true} />);
  expect(wrapper.find(SearchPopup).length).toEqual(1);
});
