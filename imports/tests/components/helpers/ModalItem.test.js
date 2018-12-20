import React from "react";
import { shallow } from "enzyme";
import ModalItem from "../../../ui/components/helpers/ModalItem";
import modalItemMocks from "../../fixtures/modalItemMocks";

test("should render ModalItem without errors", () => {
  const wrapper = shallow(<ModalItem item={modalItemMocks} />);
  expect(wrapper).toMatchSnapshot();
});

test("should return null if modalItem is empty", () => {
  const wrapper = shallow(<ModalItem item={{}} />);
  expect(wrapper).toMatchSnapshot();
});

test("should render playIcon if playIcon is true", () => {
  const wrapper = shallow(<ModalItem item={modalItemMocks} playIcon={true} />);
  expect(wrapper).toMatchSnapshot();
});
