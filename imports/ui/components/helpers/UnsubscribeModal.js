import React from "react";
import Modal from "react-modal";
import PropTypes from "prop-types";

const UnsubscribeModal = ({
  isModalOpen,
  closeUnsubscribeModal,
  unsubscribe,
  podcastId
}) => {
  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={() => closeUnsubscribeModal()}
      ariaHideApp={false}
      className="unsubscribe-modal"
      overlayClassName="unsubscribe-modal__overlay"
    >
      <h2 className="unsubscribe-modal__header">Are you sure?</h2>
      <div className="unsubscribe-modal__controls">
        <button
          onClick={() => closeUnsubscribeModal()}
          id="cancel"
          className="button"
        >
          Cancel
        </button>

        <button
          onClick={() => {
            unsubscribe(podcastId);
            closeUnsubscribeModal();
          }}
          id="unsubscribe"
          className="button button--danger"
        >
          Unsubscribe
        </button>
      </div>
    </Modal>
  );
};

UnsubscribeModal.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  closeUnsubscribeModal: PropTypes.func.isRequired,
  unsubscribe: PropTypes.func.isRequired,
  podcastId: PropTypes.number.isRequired
};

UnsubscribeModal.defaultProps = {
  isModalOpen: true,
  closeUnsubscribeModal: () => {},
  unsubscribe: () => {},
  podcastId: 1
};

export default UnsubscribeModal;
