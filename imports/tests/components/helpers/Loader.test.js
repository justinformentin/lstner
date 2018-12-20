import React from "react";
import { shallow } from "enzyme";
import Loader from "../../../ui/components/helpers/Loader";

test("should render Loader without errors", () => {
  const wrapper = shallow(<Loader />);
  expect(wrapper).toMatchSnapshot();
});
