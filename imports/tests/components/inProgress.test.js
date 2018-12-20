import React from "react";
import { shallow } from "enzyme";
import { InProgress } from "../../ui/components/InProgress";
import inProgressMocks from "../fixtures/inProgressMocks";

test("should show Login message if isLoggedIn is false", () => {
  const wrapper = shallow(<InProgress isLoggedIn={false} />);
  expect(wrapper).toMatchSnapshot();
});

test("should show Loader if isLoggedIn and loading is true", () => {
  const wrapper = shallow(<InProgress isLoggedIn={true} loading={true} />);
  expect(wrapper).toMatchSnapshot();
});

test("should show error message if error and loggedIn", () => {
  const wrapper = shallow(
    <InProgress isLoggedIn={true} error={{ error: "error text" }} />
  );
  expect(wrapper).toMatchSnapshot();
});

test("should show no episode message if inProgress is empty and loggedIn", () => {
  const wrapper = shallow(<InProgress isLoggedIn={true} inProgress={[]} />);
  expect(wrapper).toMatchSnapshot();
});

test("should render inProgress episodes", () => {
  const wrapper = shallow(
    <InProgress isLoggedIn={true} inProgress={inProgressMocks} />
  );
  expect(wrapper).toMatchSnapshot();
});
