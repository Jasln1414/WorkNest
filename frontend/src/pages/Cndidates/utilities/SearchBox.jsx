import React, { useState } from 'react';
import { GrSearch } from 'react-icons/gr';

function SearchBox({ jobData, setFilterData, setAction }) {
  const [info, setInfo] = useState({
    title: '',
    location: '',
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
    setInfo({ title: '', location: '' });
  };

  return (
    <div className="search-box">
      <form className="search-form">
        <div className="search-container">
          <GrSearch className="search-icon" />
          <div className="search-input">
            <input
              type="text"
              name="title"
              value={info.title}
              onChange={handleChange}
              placeholder="Job"
            />
          </div>
          <div className="search-divider" />
          <div className="search-input">
            <input
              type="text"
              name="location"
              value={info.location}
              onChange={handleChange}
              placeholder="Location"
            />
          </div>
          <div className="search-button">
            <button type="button" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SearchBox;