import React, { Component } from "react";
import { Session } from "meteor/session";
import Modal from "react-modal";
import PropTypes from "prop-types";

import SearchResults from "./SearchResults";

class SearchPopup extends Component {
  constructor(props) {
    super(props);

    this.searchBar = React.createRef();

    this.state = {
      searchTerm: "",
      isSearchReady: false
    };
  }

  _delayTimer;

  onInputChange(event) {
    this.setState(
      { searchTerm: event.target.value.trim(), isSearchReady: false },
      () => {
        this.doSearch(this.state.searchTerm);
      }
    );
  }

  doSearch(searchTerm) {
    //https://stackoverflow.com/questions/7849221/ajax-delay-for-search-on-typing-in-form-field#7849308
    clearTimeout(this._delayTimer);
    this._delayTimer = setTimeout(() => {
      if (searchTerm.length > 2) {
        this.setState({ isSearchReady: true });
      }
    }, 1000);
  }

  onFormSubmit(e) {
    e.preventDefault();
  }

  closeSearchModal() {
    Session.set("isSearchModelOpen", false);
  }

  render() {
    const { isSearchReady, searchTerm } = this.state;
    return (
      <Modal
        isOpen={this.props.isSearchModelOpen}
        onRequestClose={() => this.closeSearchModal()}
        ariaHideApp={false}
        onAfterOpen={() => {
          this.searchBar.current.focus();
        }}
        className="search-modal"
        overlayClassName="search-modal__overlay"
      >
        <form onSubmit={e => this.onFormSubmit(e)}>
          <input
            className="search-modal__input"
            type="text"
            ref={this.searchBar}
            placeholder="Find podcasts"
            value={searchTerm}
            onChange={e => this.onInputChange(e)}
          />
        </form>
        {isSearchReady ? <SearchResults searchTerm={searchTerm} /> : null}
      </Modal>
    );
  }
}

SearchPopup.propTypes = {
  isSearchModelOpen: PropTypes.bool.isRequired
};

SearchPopup.defaultProps = {
  isSearchModelOpen: true
};

export default SearchPopup;
