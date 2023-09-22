import React, { useEffect, useRef } from "react";
import { SearchIcon } from "../icon";
import "./styles/search.css";
export default function Search({
  show = false,
  handleSearch = () => {},
  results,
  onClose = () => {},
  openSearchRef = null,
  onSelect = () => {},
}) {
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        !openSearchRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    if (show) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [show]);

  return (
    <>
      {show && (
        <div className="absolute-blur-box">
          <div ref={searchRef}>
            <div>
              <div className="search-input-box">
                <SearchIcon />
                <input
                  onChange={(e) => {
                    handleSearch(e.target.value);
                  }}
                  className="search-input"
                />
              </div>
            </div>
            <div className="result-box">
              {results?.map((item, index) => (
                <div
                  key={"search-item" + index}
                  onClick={(e) => {
                    onSelect(e, item);
                    onClose();
                  }}
                  className="result-item"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
