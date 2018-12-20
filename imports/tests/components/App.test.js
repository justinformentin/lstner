import React from "react";
import { shallow } from "enzyme";

import { App } from "../../ui/components/App";
import AudioPlayer from "../../ui/components/AudioPlayer";

test("should render App without errors", () => {
  const wrapper = shallow(<App />);
  expect(wrapper).toMatchSnapshot();
});

test("should render AudioPlayer component if isPlayerOpen if true", () => {
  const wrapper = shallow(<App isPlayerOpen={false} />);
  expect(wrapper.find(AudioPlayer).length).toEqual(0);

  wrapper.setProps({ isPlayerOpen: true });
  expect(wrapper.find(AudioPlayer).length).toEqual(1);
});

test("should call handleNavToggle() on .top-header__overlay click", () => {
  const handleNavToggle = jest.fn();
  const wrapper = shallow(<App handleNavToggle={handleNavToggle} />);
  expect(handleNavToggle).not.toHaveBeenCalled();

  wrapper.find(".top-header__overlay").simulate("click");

  expect(handleNavToggle).toHaveBeenCalled();
});
