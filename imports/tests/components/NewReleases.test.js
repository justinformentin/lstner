import React from "react";
import { shallow } from "enzyme";
import { NewReleases } from "../../ui/components/NewReleases";
import newReleasesMocks from "../fixtures/newReleasesMocks";

test("should show Login message if isLoggedIn is false", () => {
  const wrapper = shallow(<NewReleases isLoggedIn={false} />);
  expect(wrapper).toMatchSnapshot();
});

test("should show Loader if isLoggedIn and loading is true", () => {
  const wrapper = shallow(<NewReleases isLoggedIn={true} loading={true} />);
  expect(wrapper).toMatchSnapshot();
});

test("should show error message if error and loggedIn", () => {
  const wrapper = shallow(
    <NewReleases isLoggedIn={true} error={{ error: "error text" }} />
  );
  expect(wrapper).toMatchSnapshot();
});

test("should show no episode message if newReleases is empty and loggedIn", () => {
  const wrapper = shallow(<NewReleases isLoggedIn={true} newReleases={[]} />);
  expect(wrapper).toMatchSnapshot();
});

test("should render newReleases episodes", () => {
  const wrapper = shallow(
    <NewReleases isLoggedIn={true} newReleases={newReleasesMocks} />
  );
  expect(wrapper).toMatchSnapshot();
});
