import "jsdom-global/register";

import React from "react";
import { shallow, mount } from "enzyme";
import { Auth } from "../../ui/components/Auth";
import wait from "waait";
import { MockedProvider } from "react-apollo/test-utils";
import UserMocks from "../fixtures/userMocks";

test("should render loginContent() content if user is logged in", async () => {
  const logout = jest.fn();
  const wrapper = mount(
    <MockedProvider mocks={UserMocks}>
      <Auth isLoggedIn={true} client={{}} logout={logout} />
    </MockedProvider>
  );
  await wait(0); // Wait a tick to get past the loading state

  const AuthWrapper = wrapper.update().find("Auth");
  expect(AuthWrapper.length).toEqual(1);
  expect(AuthWrapper.find("#logout").length).toEqual(1);
});

test("should render logoutContent() content if user is not logged in", () => {
  const wrapper = shallow(
    <Auth isLoggedIn={false} client={{}} logout={() => {}} />
  );
  expect(wrapper).toMatchSnapshot();
});

test("should render Modal component if isModalOpen is true", () => {
  const wrapper = shallow(
    <Auth isLoggedIn={false} client={{}} logout={() => {}} />
  );
  expect(wrapper.find("Modal").length).toEqual(0);

  wrapper.setState({ isModalOpen: true });
  expect(wrapper.find("Modal").length).toEqual(1);
});

test("should close Modal component on .modal__close click", () => {
  const wrapper = shallow(
    <Auth isLoggedIn={false} client={{}} logout={() => {}} />
  );
  wrapper.setState({ isModalOpen: true });
  expect(wrapper.find("Modal").length).toEqual(1);

  wrapper.find(".modal__close").simulate("click");

  expect(wrapper.state("isModalOpen")).toEqual(false);
  expect(wrapper.find("Modal").length).toEqual(0);
});

test("should show Signup component if isModalOpen and isSignupOpen is true", () => {
  const wrapper = shallow(
    <Auth isLoggedIn={false} client={{}} logout={() => {}} />
  );
  expect(wrapper.find("Modal").length).toEqual(0);

  wrapper.setState({ isModalOpen: true, isSignupOpen: true });
  expect(wrapper.find("Modal").length).toEqual(1);
  expect(wrapper.find("Signup").length).toEqual(1);
});

test("should show Login component if isModalOpen and isLoginOpen is true", () => {
  const wrapper = shallow(
    <Auth isLoggedIn={false} client={{}} logout={() => {}} />
  );
  expect(wrapper.find("Modal").length).toEqual(0);

  wrapper.setState({ isModalOpen: true, isLoginOpen: true });
  expect(wrapper.find("Modal").length).toEqual(1);
  expect(wrapper.find("Login").length).toEqual(1);
});

test("should close call logout() on #logout click", async () => {
  const logout = jest.fn();
  const wrapper = mount(
    <MockedProvider mocks={UserMocks}>
      <Auth isLoggedIn={true} client={{}} logout={logout} />
    </MockedProvider>
  );

  await wait(0); // Wait a tick to get past the loading state

  wrapper
    .update()
    .find("#logout")
    .simulate("click");
  expect(logout).toHaveBeenCalled();
});
