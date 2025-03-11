import React, { useState } from "react";
import { BiSearch, BiMap } from "react-icons/bi";
import "../../../Styles/Candidate/Search.css";

const SearchBox = ({ jobData, setFilterData, setAction }) => {
  const [info, setInfo] = useState({
    title: "",
    location: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInfo({
      ...info,
      [name]: value,
    });
  };

  const handleSearch = () => {
    let filtered = jobData;
    if (info.title) {
      const titleLower = info.title.toLowerCase();
      filtered = filtered.filter((job) =>
        job.title.toLowerCase().includes(titleLower)
      );
    }
    if (info.location) {
      const locationLower = info.location.toLowerCase();
      filtered = filtered.filter((job) =>
        job.location.toLowerCase().includes(locationLower)
      );
    }
    setFilterData(filtered);
    setAction(true);
  };

  return (
    <div className="indeed-search-container">
      <form
        className="indeed-search-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
      >
        {/* For desktop view - horizontal layout */}
        <div className="indeed-search-desktop">
          <div className="indeed-search-field">
            <BiSearch className="indeed-search-icon" />
            <input
              type="text"
              name="title"
              value={info.title}
              onChange={handleChange}
              placeholder="Job title, keywords, or company"
              aria-label="Job title, keywords, or company"
            />
          </div>

          <div className="indeed-search-divider"></div>

          <div className="indeed-search-field">
            <BiMap className="indeed-search-icon" />
            <input
              type="text"
              name="location"
              value={info.location}
              onChange={handleChange}
              placeholder="City, state, or zip code"
              aria-label="City, state, or zip code"
            />
          </div>

          <button type="submit" className="indeed-search-button">
            Search
          </button>
        </div>

        {/* For mobile view - stacked layout */}
        <div className="indeed-search-mobile">
          <div className="indeed-search-field">
            <BiSearch className="indeed-search-icon" />
            <input
              type="text"
              name="title"
              value={info.title}
              onChange={handleChange}
              placeholder="Job title, keywords, or company"
              aria-label="Job title, keywords, or company"
            />
          </div>

          <div className="indeed-search-field">
            <BiMap className="indeed-search-icon" />
            <input
              type="text"
              name="location"
              value={info.location}
              onChange={handleChange}
              placeholder="City, state, or zip code"
              aria-label="City, state, or zip code"
            />
          </div>

          <button type="submit" className="indeed-search-button-mobile">
            Find jobs
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBox;