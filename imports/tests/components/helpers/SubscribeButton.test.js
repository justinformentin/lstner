import React from "react";
import { shallow } from "enzyme";
import { SubscribeButton } from "../../../ui/components/helpers/SubscribeButton";

describe("SubscribeButton render", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<SubscribeButton />);
  });

  test("should render SubscribeButton without errors", () => {
    expect(wrapper).toMatchSnapshot();
  });

  test("should render LoginWarningModal if isWarningModalOpen is true", () => {
    wrapper.setProps({ isWarningModalOpen: true });
    expect(wrapper).toMatchSnapshot();
  });

  test("should render UnsubscribeModal if isUnsubscribeModalOpen is true", () => {
    wrapper.setProps({ isUnsubscribeModalOpen: true });
    expect(wrapper).toMatchSnapshot();
  });
});

describe("SubscribeButton functions calls", () => {
  test("should call handleSubscibe() with subscribed boolean on .subscribe-btn click", () => {
    const handleSubscibeSpy = spyOn(
      SubscribeButton.prototype,
      "handleSubscibe"
    );
    const wrapper = shallow(<SubscribeButton subscribed={false} />);

    expect(handleSubscibeSpy).not.toHaveBeenCalled();
    wrapper.find(".subscribe-btn").simulate("click");

    expect(handleSubscibeSpy).toHaveBeenCalledWith(false);
  });

  describe("test handleSubscibe() calls", () => {
    test("should call openWarningModal() if isLoggedIn is false", () => {
      const openWarningModalpy = spyOn(
        SubscribeButton.prototype,
        "openWarningModal"
      );

      const wrapper = shallow(<SubscribeButton isLoggedIn={false} />);

      expect(openWarningModalpy).not.toHaveBeenCalled();
      wrapper.find(".subscribe-btn").simulate("click");

      expect(openWarningModalpy).toHaveBeenCalled();
    });

    test("should call loggedHandleSubscibe() with subscribed boolean if isLoggedIn is true", () => {
      const loggedHandleSubscibeSpy = spyOn(
        SubscribeButton.prototype,
        "loggedHandleSubscibe"
      );

      const wrapper = shallow(
        <SubscribeButton isLoggedIn={true} subscribed={false} />
      );

      expect(loggedHandleSubscibeSpy).not.toHaveBeenCalled();
      wrapper.find(".subscribe-btn").simulate("click");

      expect(loggedHandleSubscibeSpy).toHaveBeenCalledWith(false);
    });

    describe("test loggedHandleSubscibe() calls", () => {
      test("should call subscribe() if subscribe is false", () => {
        const subscribeSpy = spyOn(SubscribeButton.prototype, "subscribe");

        const wrapper = shallow(
          <SubscribeButton isLoggedIn={true} subscribed={false} />
        );

        expect(subscribeSpy).not.toHaveBeenCalled();
        wrapper.find(".subscribe-btn").simulate("click");

        expect(subscribeSpy).toHaveBeenCalled();
      });

      test("should call openUnsubscribeModal() if subscribe is true", () => {
        const openUnsubscribeModalSpy = spyOn(
          SubscribeButton.prototype,
          "openUnsubscribeModal"
        );

        const wrapper = shallow(
          <SubscribeButton isLoggedIn={true} subscribed={true} />
        );

        expect(openUnsubscribeModalSpy).not.toHaveBeenCalled();
        wrapper.find(".subscribe-btn").simulate("click");

        expect(openUnsubscribeModalSpy).toHaveBeenCalled();
      });
    });
  });
});
