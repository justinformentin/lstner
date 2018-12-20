import "jsdom-global/register";

import React from "react";
import { shallow } from "enzyme";
import { DiscoverByGenre } from "../../ui/components/DiscoverByGenre";
import GenresPreviewsMocks from "../fixtures/genresPreviewsMocks";

test("should render div with error text when Error", () => {
  const wrapper = shallow(
    <DiscoverByGenre
      loading={false}
      error={{ error: "Error" }}
      podcastsPreviews={[]}
    />
  );

  expect(wrapper.find(".error__message").length).toEqual(1);
});

test("should render Loader episode when loading is true", () => {
  const wrapper = shallow(
    <DiscoverByGenre loading={true} error={undefined} podcastsPreviews={[]} />
  );

  expect(wrapper.find("Loader").length).toEqual(1);
});

test("should render DiscoverByGenre with data", () => {
  const wrapper = shallow(
    <DiscoverByGenre
      loading={false}
      error={undefined}
      podcastsPreviews={GenresPreviewsMocks}
    />
  );

  expect(wrapper).toMatchSnapshot();
});

test("should increase limit by 10 on .button--load click", () => {
  const wrapper = shallow(
    <DiscoverByGenre
      loading={false}
      error={undefined}
      podcastsPreviews={GenresPreviewsMocks}
    />
  );
  const prevLimit = wrapper.state("limit");
  wrapper.find(".button--load").simulate("click");
  expect(wrapper.state("limit")).toEqual(prevLimit + 10);
});

test("should not display .button--load when limit is bigger or equal to podcastsPreviews length", () => {
  const wrapper = shallow(
    <DiscoverByGenre
      loading={false}
      error={undefined}
      podcastsPreviews={GenresPreviewsMocks}
    />
  );

  const previewsLength = GenresPreviewsMocks.length;
  wrapper.setState({ limit: previewsLength + 10 });

  expect(wrapper.find(".button--load").length).toEqual(0);
});
