import React from "react";
import { shallow } from "enzyme";
import { Podcasts } from "../../ui/components/Podcasts";
import subscribedPodcastsMocks from "../fixtures/subscribedPodcastsMocks";

test("should show Login message if isLoggedIn is false", () => {
  const wrapper = shallow(<Podcasts isLoggedIn={false} />);
  expect(wrapper).toMatchSnapshot();
});

test("should show Loader if isLoggedIn and loading is true", () => {
  const wrapper = shallow(<Podcasts isLoggedIn={true} loading={true} />);
  expect(wrapper).toMatchSnapshot();
});

test("should show error message if error and loggedIn", () => {
  const wrapper = shallow(
    <Podcasts isLoggedIn={true} error={{ error: "error text" }} />
  );
  expect(wrapper).toMatchSnapshot();
});

test("should show no subscribed podcasts message if podcasts is empty and loggedIn", () => {
  const wrapper = shallow(<Podcasts isLoggedIn={true} podcasts={[]} />);
  expect(wrapper).toMatchSnapshot();
});

test("should render subscribed podcasts", () => {
  const wrapper = shallow(
    <Podcasts isLoggedIn={true} podcasts={subscribedPodcastsMocks} />
  );
  expect(wrapper).toMatchSnapshot();
});
