import React from "react";
import { shallow } from "enzyme";
import LoginWarningModal from "../../../ui/components/helpers/LoginWarningModal";

test("should render LoginWarningModal without errors", () => {
  const wrapper = shallow(<LoginWarningModal />);
  expect(wrapper).toMatchSnapshot();
});
