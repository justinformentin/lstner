import React from "react";
import { shallow } from "enzyme";
import wait from "waait";
import SearchPopup from "../../../ui/components/helpers/SearchPopup";
import SearchResults from "../../../ui/components/helpers/SearchResults";

describe("Render tests", () => {
  test("should render SearchPopup without errors", () => {
    const wrapper = shallow(<SearchPopup />);
    expect(wrapper).toMatchSnapshot();
  });

  test("should render SearchResults if this.state.isSearchReady is true", () => {
    const wrapper = shallow(<SearchPopup />);
    wrapper.setState({ isSearchReady: false });

    expect(wrapper.find(SearchResults).length).toEqual(0);
    wrapper.setState({ isSearchReady: true });

    expect(wrapper.find(SearchResults).length).toEqual(1);
  });
});

describe("Methods tests", () => {
  test("should call onInputChange() on .search-modal__input change", () => {
    const spy = spyOn(SearchPopup.prototype, "onInputChange");
    const target = { value: "Test String" };
    const wrapper = shallow(<SearchPopup />);

    expect(spy).not.toHaveBeenCalled();
    wrapper.find(".search-modal__input").simulate("change", { target });

    expect(spy).toHaveBeenCalledWith({ target });
  });

  test("should call onFormSubmit() on form submit", () => {
    const spy = spyOn(SearchPopup.prototype, "onFormSubmit");
    const preventDefault = () => {};
    const wrapper = shallow(<SearchPopup />);

    expect(spy).not.toHaveBeenCalled();
    wrapper.find("form").simulate("submit", { preventDefault });

    expect(spy).toHaveBeenCalledWith({ preventDefault });
  });

  test("on onInputChange() call should call doSearch() ", () => {
    const spy = spyOn(SearchPopup.prototype, "doSearch");
    const target = { value: "Test String" };
    const wrapper = shallow(<SearchPopup />);

    expect(spy).not.toHaveBeenCalled();
    wrapper.find(".search-modal__input").simulate("change", { target });

    expect(spy).toHaveBeenCalled();
  });

  describe("doSearch() tests", () => {
    test("on doSearch() should setState if searchTerm length >  2", async () => {
      const event = { target: { value: "Test String" } };
      const wrapper = shallow(<SearchPopup />);
      wrapper.setState({ isSearchReady: false });

      wrapper.find(".search-modal__input").simulate("change", event);
      await wait(1500);

      expect(wrapper.state("isSearchReady")).toEqual(true);
    });

    test("on doSearch() should NOT setState if searchTerm length <= 2", () => {
      const target = { value: "Te" };
      const wrapper = shallow(<SearchPopup />);
      wrapper.setState({ isSearchReady: false });

      wrapper.find(".search-modal__input").simulate("change", { target });

      expect(wrapper.state("isSearchReady")).toEqual(false);
    });
  });
});
