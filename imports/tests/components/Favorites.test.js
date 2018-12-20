import React from "react";
import { shallow } from "enzyme";
import { Favorites } from "../../ui/components/Favorites";
import favoriteMocks from "../fixtures/favoritesMocks";

test("should show Login message if isLoggedIn is false", () => {
  const wrapper = shallow(<Favorites isLoggedIn={false} />);
  expect(wrapper).toMatchSnapshot();
});

test("should show Loader if isLoggedIn and loading is true", () => {
  const wrapper = shallow(<Favorites isLoggedIn={true} loading={true} />);
  expect(wrapper).toMatchSnapshot();
});

test("should show error message if error and loggedIn", () => {
  const wrapper = shallow(
    <Favorites isLoggedIn={true} error={{ error: "error text" }} />
  );
  expect(wrapper).toMatchSnapshot();
});

test("should show no episode message if favorites is empty and loggedIn", () => {
  const wrapper = shallow(<Favorites isLoggedIn={true} favorites={[]} />);
  expect(wrapper).toMatchSnapshot();
});

test("should render favorite episodes", () => {
  const wrapper = shallow(
    <Favorites isLoggedIn={true} favorites={favoriteMocks} />
  );
  expect(wrapper).toMatchSnapshot();
});
