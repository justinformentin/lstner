import React from "react";
import { shallow } from "enzyme";
import { EpisodeModal } from "../../../ui/components/helpers/EpisodeModal";
import {
  episodeWithLink,
  episodeWithoutLink
} from "../../fixtures/episodeModalMocks";

test("should render EpisodeModal without errors", () => {
  const wrapper = shallow(<EpisodeModal episode={episodeWithoutLink} />);
  expect(wrapper).toMatchSnapshot();
});

test("should show link to episode if provided", () => {
  const wrapper = shallow(<EpisodeModal episode={episodeWithLink} />);
  expect(wrapper).toMatchSnapshot();
});

test("should show Loader if loading is true", () => {
  const wrapper = shallow(<EpisodeModal loading={true} />);
  expect(wrapper).toMatchSnapshot();
});

test("should show error message if error", () => {
  const wrapper = shallow(<EpisodeModal error={{ error: "error text" }} />);
  expect(wrapper).toMatchSnapshot();
});

test("should show error message if episode is empty", () => {
  const wrapper = shallow(<EpisodeModal episode={{}} />);
  expect(wrapper).toMatchSnapshot();
});

test("should render episode information", () => {
  const wrapper = shallow(<EpisodeModal episode={episodeWithoutLink} />);
  expect(wrapper).toMatchSnapshot();
});

test("should call handleEpisodeModal() on .modal__close click", () => {
  const handleEpisodeModal = jest.fn();
  const wrapper = shallow(
    <EpisodeModal
      episode={episodeWithoutLink}
      handleEpisodeModal={handleEpisodeModal}
    />
  );

  expect(handleEpisodeModal).not.toHaveBeenCalled();
  wrapper.find(".modal__close").simulate("click");

  expect(handleEpisodeModal).toHaveBeenCalled();
});
