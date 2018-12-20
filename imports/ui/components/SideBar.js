import React from "react";
import { Link } from "react-router-dom";
import { Session } from "meteor/session";

import Auth from "./Auth";

const SideBar = () => {
  return (
    <nav>
      <Link className="sidebar__logo" to="/">
        <img src="logo.png" alt="Lstner logo" />
        <h2 className="sidebar-text__logo">Lstner</h2>
      </Link>
      <div className="sidebar__links">
        <Link onClick={() => closeSidebar()} className="sidebar__link" to="/">
          Podcasts
        </Link>
 
        <Link
          onClick={() => closeSidebar()}
          className="sidebar__link"
          to="/discover"
        >
          Discover
        </Link>

        <Link
          onClick={() => closeSidebar()}
          className="sidebar__link"
          to="/new-releases"
        >
          New Releases
        </Link>

        <Link
          onClick={() => closeSidebar()}
          className="sidebar__link"
          to="/in-progress"
        >
          In Progress
        </Link>

        <Link
          onClick={() => closeSidebar()}
          className="sidebar__link"
          to="/favorites"
        >
          Favorites
        </Link>
        <Auth closeSidebar={closeSidebar} />
      </div>
    </nav>
  );
};

function closeSidebar() {
  Session.set("isNavOpen", false);
}

export default SideBar;
