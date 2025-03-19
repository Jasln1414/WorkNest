import React from 'react';
import { GrSearch } from 'react-icons/gr';
import { GoLocation } from 'react-icons/go';
import '../../../Styles/USER/Search.css';

function SearchBar({ searchParams, handleSearchInputChange, handleSearch }) {
  return (
    <form className="search-form" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
      <div className="search-input-container">
        <div className="search-input-group">
          <div className="icon-wrapper">
            <GrSearch className="search-icon" />
          </div>
          <input
            type="text"
            name="keyword"
            value={searchParams.keyword}
            onChange={handleSearchInputChange}
            className="search-input"
            placeholder="Job title, keywords, or company"
          />
        </div>
        
        <div className="search-divider"></div>
        
        <div className="search-input-group">
          <div className="icon-wrapper">
            <GoLocation className="location-icon" />
          </div>
          <input
            type="text"
            name="location"
            value={searchParams.location}
            onChange={handleSearchInputChange}
            className="search-input"
            placeholder="City, state, zip code, or 'remote'"
          />
        </div>
        
        <button
          type="submit"
          className="search-button"
        >
          Find jobs
        </button>
      </div>
    </form>
  );
}

export default SearchBar;