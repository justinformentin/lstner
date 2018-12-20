import React from "react";
import { Session } from "meteor/session";
import { withTracker } from "meteor/react-meteor-data";
import PropTypes from "prop-types";

import SearchPopup from "./helpers/SearchPopup";

export const InnerHeader = ({ title, isSearchModelOpen }) => {
  return (
    <div className="inner-header">
      {title ? <h1 className="inner-header__title">{title}</h1> : null}
      <div className="inner-header__content">
        <div
          className="inner-header__back-btn"
          onClick={() => this.history.back()}
        >
          Go Back
        </div>
        <div className="inner-header__search">
          <button
            className="inner-header__search-btn"
            onClick={() => openSearchModal()}
          >
            Find podcasts
          </button>
          {isSearchModelOpen ? (
            <SearchPopup isSearchModelOpen={isSearchModelOpen} />
          ) : null}
        </div>
      </div>
    </div>
  );
};

function openSearchModal() {
  Session.set("isSearchModelOpen", true);
}

InnerHeader.propTypes = {
  title: PropTypes.string,
  isSearchModelOpen: PropTypes.bool.isRequired
};

InnerHeader.defaultProps = {
  isSearchModelOpen: false
};

export default withTracker(() => {
  return {
    isSearchModelOpen: Session.get("isSearchModelOpen")
  };
})(InnerHeader);
