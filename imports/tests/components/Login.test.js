import "jsdom-global/register";

import React from "react";
import { mount } from "enzyme";
import { Login } from "../../ui/components/Login";

test("should render Login correctly", () => {
  const wrapper = mount(
    <Login
      onSwap={() => {}}
      onClose={() => {}}
      client={{}}
      loginWithPassword={() => {}}
    />
  );

  expect(wrapper).toMatchSnapshot();
});

test("should call onSwap() on .auth-modal__text-btn click", () => {
  const onSwap = jest.fn();
  const wrapper = mount(
    <Login
      onSwap={onSwap}
      onClose={() => {}}
      client={{}}
      loginWithPassword={() => {}}
    />
  );

  wrapper.find(".auth-modal__text-btn").simulate("click");

  expect(onSwap).toHaveBeenCalled();
});

test("should call loginWithPassword with the form data", () => {
  const email = "qwerty@test.com";
  const password = "password123";
  const loginWithPassword = jest.fn();

  const wrapper = mount(
    <Login
      onSwap={() => {}}
      onClose={() => {}}
      client={{}}
      loginWithPassword={loginWithPassword}
    />
  );

  wrapper.find('input[name="email"]').instance().value = email;
  wrapper.find('input[name="password"]').instance().value = password;
  wrapper.find("form").simulate("submit");

  expect(loginWithPassword).toHaveBeenCalledWith(
    { email },
    password,
    expect.any(Function)
  );
});

test("should show error messages", () => {
  const error = "This is not working";
  const wrapper = mount(
    <Login
      onSwap={() => {}}
      onClose={() => {}}
      client={{}}
      loginWithPassword={() => {}}
    />
  );

  wrapper.setState({ error });
  expect(wrapper.find("p").text()).toEqual(error);

  wrapper.setState({ error: "" });
  expect(wrapper.find("p").length).toEqual(0);
});
