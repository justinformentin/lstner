import "jsdom-global/register";

import React from "react";
import { shallow } from "enzyme";
import { Feed } from "../../ui/components/Feed";
import newReleasesMocks from "../fixtures/newReleasesMocks";

describe("Render tests", () => {
  test("should render Feed without errors", () => {
    const wrapper = shallow(<Feed />);
    expect(wrapper).toMatchSnapshot();
  });

  test("should render empty message if feed is empty", () => {
    const wrapper = shallow(<Feed feed={[]} />);
    expect(wrapper).toMatchSnapshot();
  });

  test("should render episodes", () => {
    const renderFeed = spyOn(Feed.prototype, "renderFeed");
    const wrapper = shallow(<Feed feed={newReleasesMocks} />);

    expect(wrapper).toMatchSnapshot();
    expect(renderFeed).toHaveBeenCalled();
  });
});
