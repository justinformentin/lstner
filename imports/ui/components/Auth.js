import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { Session } from "meteor/session";
import Modal from "react-modal";
import { Query, withApollo } from "react-apollo";
import { withTracker } from "meteor/react-meteor-data";
import PropTypes from "prop-types";

import Login from "./Login";
import Signup from "./Signup";

import getLoggedUser from "../queries/getLoggedUser";

export class Auth extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false,
      isSignupOpen: false,
      isLoginOpen: false
    };

    this.closeAuthModal = this.closeAuthModal.bind(this);
    this.swapForms = this.swapForms.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
  }

  closeAuthModal() {
    this.setState({
      isModalOpen: false,
      isLoginOpen: false,
      isSignupOpen: false
    });
  }

  onSuccess() {
    this.closeAuthModal();
  }

  loginContent() {
    const { closeSidebar } = this.props;
    return (
      <React.Fragment>
        <div
          id="signin"
          className="sidebar__link"
          onClick={() =>
            this.setState(
              {
                isModalOpen: true,
                isLoginOpen: true
              },
              () => {
                closeSidebar();
              }
            )
          }
        >
          Sign In
        </div>
        <div
          id="signup"
          className="sidebar__link"
          onClick={() =>
            this.setState(
              {
                isModalOpen: true,
                isSignupOpen: true
              },
              () => {
                closeSidebar();
              }
            )
          }
        >
          Sing Up
        </div>
      </React.Fragment>
    );
  }
 
  logoutContent() {
    return (
      <Query query={getLoggedUser} skip={!this.props.isLoggedIn}>
        {({ loading, error, data }) => {
          if (loading) return null;
          if (error) throw error;

          const { client, closeSidebar } = this.props;

          return (
            <React.Fragment>
              {/* <div className="sidebar__link">{data.user.email}</div> */}
              <div
                id="logout"
                className="sidebar__link"
                onClick={() => {
                  this.props.logout(() => {
                    client.resetStore();
                    Session.set("isPlayerOpen", false);
                    closeSidebar();
                  });
                }}
              >
                Logout
              </div>
            </React.Fragment>
          );
        }}
      </Query>
    );
  }

  modalContent() {
    const { isSignupOpen, isLoginOpen } = this.state;
    const { client } = this.props;
    if (isSignupOpen)
      return (
        <Signup
          onClose={this.closeAuthModal}
          onSuccess={this.onSuccess}
          onSwap={this.swapForms}
          client={client}
        />
      );
    if (isLoginOpen)
      return (
        <Login
          onClose={this.closeAuthModal}
          onSuccess={this.onSuccess}
          onSwap={this.swapForms}
          client={client}
        />
      );
  }

  swapForms() {
    const { isSignupOpen, isLoginOpen } = this.state;
    this.setState({
      isSignupOpen: !isSignupOpen,
      isLoginOpen: !isLoginOpen
    });
  }

  render() {
    const { isModalOpen, isLoginOpen } = this.state;

    return (
      <div className="auth">
        {this.props.isLoggedIn ? this.logoutContent() : this.loginContent()}
        {isModalOpen ? (
          <Modal
            isOpen={isModalOpen}
            onRequestClose={() => this.closeAuthModal()}
            ariaHideApp={false}
            className="auth-modal"
            overlayClassName="auth-modal__overlay"
          >
            <div className="modal__header">
              <h2 className="modal__title">{isLoginOpen ? "Login" : "Join"}</h2>
              <div
                className="modal__close"
                onClick={() => this.closeAuthModal()}
              />
            </div>
            {this.modalContent()}
          </Modal>
        ) : null}
      </div>
    );
  }
}

Auth.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  client: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired
};

Auth.defaultProps = {
  isLoggedIn: false,
  client: {},
  logout: () => {}
};

export default withTracker(() => {
  return { logout: Meteor.logout, isLoggedIn: !!Meteor.userId() };
})(withApollo(Auth));
