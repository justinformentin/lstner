import React from "react";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";

const ModalItem = ({ item, playIcon = false }) => {
  if (isEmpty(item)) {
    return null;
  }

  return (
    <React.Fragment>
      <div
        className="modal-item__artwork"
        style={{
          backgroundImage: `url("${item.podcastArtworkUrl || item.artworkUrl}")`
        }}
      >
        {playIcon ? playIconSvg : null}
      </div>

      <div className="modal-item__info">
        <div className="modal-item__title" title={item.title}>
          {item.title}
        </div>
        <div className="modal-item__author">{item.author}</div>
      </div>
    </React.Fragment>
  );
};

ModalItem.propTypes = {
  item: PropTypes.object.isRequired,
  playIcon: PropTypes.bool
};

export default ModalItem;

const playIconSvg = (
  <svg
    className="modal-item__play-icon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 250 250"
  >
    <path d="M125,0A125,125,0,1,0,250,125,125,125,0,0,0,125,0ZM85.67,192.79V56.54l118,68.13Z" />
  </svg>
);
