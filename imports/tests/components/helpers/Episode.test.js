import React from "react";
import { shallow } from "enzyme";
import Episode from "../../../ui/components/helpers/Episode";
import {
  episodeWithArtwork,
  episodeWithoutArtwork,
  episodeWithAuthor
} from "../../fixtures/episodeMocks";

test("should render Episode without errors", () => {
  const wrapper = shallow(<Episode episode={episodeWithoutArtwork} />);
  expect(wrapper).toMatchSnapshot();
});

test("should render Episode artwork if provided", () => {
  const wrapper = shallow(<Episode episode={episodeWithArtwork} />);
  expect(wrapper).toMatchSnapshot();
});

test("should render Episode author if provided", () => {
  const wrapper = shallow(<Episode episode={episodeWithAuthor} />);
  expect(wrapper).toMatchSnapshot();
});

test("should return null if episode is empty", () => {
  const wrapper = shallow(<Episode episode={{}} />);
  expect(wrapper).toMatchSnapshot();
});

test("should call handleEpisodeModal() with episode id and podcastId values on .title__text click", () => {
  const handleEpisodeModal = jest.fn();
  const wrapper = shallow(
    <Episode
      episode={episodeWithoutArtwork}
      handleEpisodeModal={handleEpisodeModal}
    />
  );
  const { id, podcastId } = episodeWithoutArtwork;

  wrapper.find(".title__text").simulate("click");

  expect(handleEpisodeModal).toHaveBeenCalledWith(id, podcastId);
});

test("should call handleFavorites() with episode id, podcastId and inFavorites values on #star__icon click", () => {
  const handleFavorites = jest.fn();
  const wrapper = shallow(
    <Episode
      episode={episodeWithoutArtwork}
      handleFavorites={handleFavorites}
    />
  );
  const { id, podcastId, inFavorites } = episodeWithoutArtwork;

  wrapper.find("#star__icon").simulate("click");

  expect(handleFavorites).toHaveBeenCalledWith(id, podcastId, inFavorites);
});

test("should call handleStatus() with episode id, podcastId and isPlayed values on #controls__status-icon click", () => {
  const handleStatus = jest.fn();
  const wrapper = shallow(
    <Episode episode={episodeWithoutArtwork} handleStatus={handleStatus} />
  );
  const { id, podcastId, isPlayed } = episodeWithoutArtwork;

  wrapper.find("#controls__status-icon").simulate("click");

  expect(handleStatus).toHaveBeenCalledWith(id, podcastId, isPlayed);
});

test("should call handleUpnext() with episode id, podcastId and inUpnext values on #controls__up-next click", () => {
  const handleUpnext = jest.fn();
  const wrapper = shallow(
    <Episode episode={episodeWithoutArtwork} handleUpnext={handleUpnext} />
  );
  const { id, podcastId, inUpnext } = episodeWithoutArtwork;

  wrapper.find("#controls__up-next").simulate("click");

  expect(handleUpnext).toHaveBeenCalledWith(id, podcastId, inUpnext);
});

test("should call handleClick() with episode id and  podcastId values on #controls__play click", () => {
  const handleClick = jest.fn();
  const wrapper = shallow(
    <Episode episode={episodeWithoutArtwork} handleClick={handleClick} />
  );
  const { id, podcastId } = episodeWithoutArtwork;

  wrapper.find("#controls__play").simulate("click");

  expect(handleClick).toHaveBeenCalledWith(id, podcastId);
});
