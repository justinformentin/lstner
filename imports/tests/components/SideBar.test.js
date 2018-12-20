import React from "react";
import { shallow } from "enzyme";
import SideBar from "../../ui/components/SideBar";

test("should render SideBar correctly", () => {
  const wrapper = shallow(<SideBar />);

  expect(wrapper).toMatchSnapshot();
});
