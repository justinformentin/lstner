import "jsdom-global/register";

import React from "react";
import { mount } from "enzyme";
import { Signup } from "../../ui/components/Signup";

test("should render Login correctly", () => {
  const wrapper = mount(
    <Signup
      onSwap={() => {}}
      onClose={() => {}}
      client={{}}
      createUser={() => {}}
    />
  );

  expect(wrapper).toMatchSnapshot();
});

test("should call onSwap() on .auth-modal__text-btn click", () => {
  const onSwap = jest.fn();
  const wrapper = mount(
    <Signup
      onSwap={onSwap}
      onClose={() => {}}
      client={{}}
      loginWithPassword={() => {}}
    />
  );

  wrapper.find(".auth-modal__text-btn").simulate("click");

  expect(onSwap).toHaveBeenCalled();
});

test("should show error messages", () => {
  const error = "This is not working";
  const wrapper = mount(
    <Signup createUser={() => {}} onClose={() => {}} client={{}} />
  );

  wrapper.setState({ error });
  expect(wrapper.find("p").text()).toEqual(error);

  wrapper.setState({ error: "" });
  expect(wrapper.find("p").length).toEqual(0);
});

test("should call createUser with the form data", () => {
  const email = "qwerty@test.com";
  const password = "password123";
  const createUser = jest.fn();

  const wrapper = mount(
    <Signup createUser={createUser} onClose={() => {}} client={{}} />
  );

  wrapper.find('input[name="email"]').instance().value = email;
  wrapper.find('input[name="password"]').instance().value = password;
  wrapper.find("form").simulate("submit");

  expect(createUser).toHaveBeenCalledWith(
    { email, password },
    expect.any(Function)
  );
});

test("should set error if short password", () => {
  const email = "qwerty@test.com";
  const password = "pass          ";
  const createUser = jest.fn();

  const wrapper = mount(
    <Signup createUser={createUser} onClose={() => {}} client={{}} />
  );

  wrapper.find('input[name="email"]').instance().value = email;
  wrapper.find('input[name="password"]').instance().value = password;
  wrapper.find("form").simulate("submit");

  expect(wrapper.find("Signup").instance().state.error).not.toEqual("");
});
