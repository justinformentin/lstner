import "jsdom-global/register";

import React from "react";
import { shallow } from "enzyme";
import { Discover } from "../../ui/components/Discover";
import GenresMocks from "../fixtures/genresMocks";

test("should render div with error text when Error", () => {
  const wrapper = shallow(
    <Discover loading={false} error={{ error: "Error" }} genres={GenresMocks} />
  );

  expect(wrapper.find(".error__message").length).toEqual(1);
});

test("should render Loader episode when loading is true", () => {
  const wrapper = shallow(
    <Discover loading={true} error={undefined} genres={GenresMocks} />
  );

  expect(wrapper.find("Loader").length).toEqual(1);
});

test("should render Discover with data", () => {
  const wrapper = shallow(
    <Discover loading={false} error={undefined} genres={GenresMocks} />
  );

  expect(wrapper).toMatchSnapshot();
});
