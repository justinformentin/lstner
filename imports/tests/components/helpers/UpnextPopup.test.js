import React from "react";
import { shallow } from "enzyme";

import { UpnextPopup } from "../../../ui/components/helpers/UpnextPopup";
import upnextPopupMocks, {
  singleEpisode
} from "../../fixtures/upnextPopupMocks";

describe("Render tests", () => {
  test("should render UpnextPopup without errors", () => {
    const wrapper = shallow(<UpnextPopup />);
    expect(wrapper).toMatchSnapshot();
  });

  test("should show Loader if loading is true", () => {
    const wrapper = shallow(<UpnextPopup loading={true} />);
    expect(wrapper).toMatchSnapshot();
  });

  test("should show error message if error", () => {
    const wrapper = shallow(<UpnextPopup error={{ error: "error text" }} />);
    expect(wrapper).toMatchSnapshot();
  });

  test("should show error message if searchPreviews is empty", () => {
    const wrapper = shallow(<UpnextPopup localUpnext={[]} />);
    expect(wrapper).toMatchSnapshot();
  });

  test("should render episode information", () => {
    const wrapper = shallow(<UpnextPopup localUpnext={upnextPopupMocks} />);
    expect(wrapper).toMatchSnapshot();
  });
});

describe("Methods tests", () => {
  test("should call handleUpnextPopup() on .modal__close click", () => {
    const handleUpnextPopup = jest.fn();
    const wrapper = shallow(
      <UpnextPopup handleUpnextPopup={handleUpnextPopup} />
    );

    expect(handleUpnextPopup).not.toHaveBeenCalled();
    wrapper.find(".modal__close").simulate("click");

    expect(handleUpnextPopup).toHaveBeenCalled();
  });

  describe("handleClick() tests", () => {
    test("should call setPlayingEpisode() on .modal__item click if loggedIn", () => {
      const setPlayingEpisode = jest.fn(
        () =>
          new Promise(resolve => {
            resolve();
          })
      );
      const wrapper = shallow(
        <UpnextPopup
          localUpnext={singleEpisode}
          isLoggedIn={true}
          setPlayingEpisode={setPlayingEpisode}
        />
      );
      expect(setPlayingEpisode).not.toHaveBeenCalled();
      wrapper.find(".modal__item").simulate("click");

      expect(setPlayingEpisode).toHaveBeenCalled();
    });

    test("should call setLocalPlayingEpisode() on .modal__item click if not loggedIn", () => {
      const setLocalPlayingEpisode = jest.fn(
        () =>
          new Promise(resolve => {
            resolve();
          })
      );
      const wrapper = shallow(
        <UpnextPopup
          localUpnext={singleEpisode}
          isLoggedIn={false}
          setLocalPlayingEpisode={setLocalPlayingEpisode}
        />
      );
      expect(setLocalPlayingEpisode).not.toHaveBeenCalled();
      wrapper.find(".modal__item").simulate("click");

      expect(setLocalPlayingEpisode).toHaveBeenCalled();
    });
  });

  describe("handleRemove() tests", () => {
    test("should call removeFromUpnext() on .modal__remove click if loggedIn", () => {
      const removeFromUpnext = jest.fn(
        () =>
          new Promise(resolve => {
            resolve();
          })
      );
      const wrapper = shallow(
        <UpnextPopup
          localUpnext={singleEpisode}
          isLoggedIn={true}
          removeFromUpnext={removeFromUpnext}
        />
      );
      expect(removeFromUpnext).not.toHaveBeenCalled();
      wrapper
        .find(".modal__remove")
        .simulate("click", { stopPropagation: () => {} });

      expect(removeFromUpnext).toHaveBeenCalled();
    });

    test("should call removeFromLocalUpnext() on .modal__remove click if not loggedIn", () => {
      const removeFromLocalUpnext = jest.fn(
        () =>
          new Promise(resolve => {
            resolve();
          })
      );
      const wrapper = shallow(
        <UpnextPopup
          localUpnext={singleEpisode}
          isLoggedIn={false}
          removeFromLocalUpnext={removeFromLocalUpnext}
        />
      );
      expect(removeFromLocalUpnext).not.toHaveBeenCalled();
      wrapper
        .find(".modal__remove")
        .simulate("click", { stopPropagation: () => {} });

      expect(removeFromLocalUpnext).toHaveBeenCalled();
    });
  });
});
