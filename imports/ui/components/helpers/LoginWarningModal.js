import React from "react";
import Modal from "react-modal";
import PropTypes from "prop-types";

const LoginWarningModal = ({ isModalOpen, closeWarningModal }) => {
  setTimeout(closeWarningModal, 3000);

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={() => closeWarningModal()}
      ariaHideApp={false}
      className="warning-modal"
      overlayClassName="warning-modal__overlay"
    >
      <h2 className="warning-modal__header">Warning.</h2>
      <p className="warning-modal__text">
        Please log in or sign up to perform that action.
      </p>
    </Modal>
  );
};

LoginWarningModal.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  closeWarningModal: PropTypes.func.isRequired
};

LoginWarningModal.defaultProps = {
  isModalOpen: true,
  closeWarningModal: () => {}
};

export default LoginWarningModal;
