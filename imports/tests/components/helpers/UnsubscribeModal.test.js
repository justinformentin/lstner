import React from "react";
import { shallow } from "enzyme";
import UnsubscribeModal from "../../../ui/components/helpers/UnsubscribeModal";

test("should render UnsubscribeModal without errors", () => {
  const wrapper = shallow(<UnsubscribeModal />);
  expect(wrapper).toMatchSnapshot();
});

test("should call closeUnsubscribeModal() on #cancel click", () => {
  const closeUnsubscribeModal = jest.fn();
  const wrapper = shallow(
    <UnsubscribeModal closeUnsubscribeModal={closeUnsubscribeModal} />
  );

  wrapper.find("#cancel").simulate("click");

  expect(closeUnsubscribeModal).toHaveBeenCalled();
});

test("should call unsubscribe() with podcastId and closeUnsubscribeModal() on #unsubscribe click", () => {
  const unsubscribe = jest.fn();
  const closeUnsubscribeModal = jest.fn();
  const podcastId = 928159684;
  const wrapper = shallow(
    <UnsubscribeModal
      podcastId={podcastId}
      unsubscribe={unsubscribe}
      closeUnsubscribeModal={closeUnsubscribeModal}
    />
  );

  wrapper.find("#unsubscribe").simulate("click");

  expect(unsubscribe).toHaveBeenCalledWith(podcastId);
  expect(closeUnsubscribeModal).toHaveBeenCalled();
});
