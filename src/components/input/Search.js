import React from "react";
import { SearchIcon } from "../icon";
import "./styles/search.css";
export default function Search({ show = false }) {
  return (
    <>
      {show && (
        <div className="absolute-blur-box">
          <div>
            <div className="search-input-box">
              <SearchIcon />
              <input className="search-input" />
            </div>
          </div>
          <div className="result-box">result</div>
        </div>
      )}
    </>
  );
}
