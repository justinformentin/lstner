import React from "react";
import { shallow } from "enzyme";
import { Header } from "../../ui/components/Header";

test("should render Header correctly", () => {
  const wrapper = shallow(<Header />);
  expect(wrapper).toMatchSnapshot();
});

test("should call handleNavToggle on toogle click", () => {
  const handleNavToggleSpy = jest.fn();
  const wrapper = shallow(<Header handleNavToggle={handleNavToggleSpy} />);
  wrapper.find(".top-header__nav-toogle").simulate("click");
  expect(handleNavToggleSpy).toHaveBeenCalled();
});
