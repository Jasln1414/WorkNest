import React, { useState, useEffect, useRef } from 'react';
import '../../../Styles/USER/Search.css';

const QuickFilterDropdowns = ({ filters, setFilters, handleSearch }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownContainerRef = useRef(null);

  const filterOptions = [
    {
      key: "jobmode",
      label: "Job Mode",
      options: [
        { label: "Any Mode", value: "" },
        { label: "Remote", value: "Remote" },
        { label: "On Site", value: "On Site" },
        { label: "Hybrid", value: "Hybrid" },
      ],
    },
    {
      key: "jobtype",
      label: "Job Type",
      options: [
        { label: "Any Type", value: "" },
        { label: "Full Time", value: "Full Time" },
        { label: "Part Time", value: "Part Time" },
      ],
    },
    {
      key: "experience",
      label: "Experience",
      options: [
        { label: "Any Experience", value: "" },
        { label: "Internship", value: "Internship" },
        { label: "Entry Level", value: "Entry Level" },
        { label: "Associate", value: "Associate" },
        { label: "Mid Level", value: "Mid Level" },
        { label: "Senior Level", value: "Senior Level" },
      ],
    },
    {
      key: "lpa",
      label: "Salary Range (LPA)",
      options: [
        { label: "Any Salary", value: "" },
        { label: "0 - 3 LPA", value: "0-3" },
        { label: "3 - 6 LPA", value: "3-6" },
        { label: "6 - 10 LPA", value: "6-10" },
        { label: "10+ LPA", value: "10-999" },
      ],
    },
    {
      key: "location",
      label: "Location",
      options: [
        { label: "Any Location", value: "" },
        { label: "Miami", value: "Miami" },
        { label: "Tampa", value: "Tampa" },
        { label: "Nashville", value: "Nashville" },
        { label: "Florida", value: "Florida" },
        { label: "Remote", value: "Remote" },
      ],
    },
  ];

  const handleDropdownChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    console.log(`Sending filter - ${key}: "${value}"`); // Enhanced logging
    setTimeout(() => handleSearch(newFilters), 0);
    setOpenDropdown(null);
  };

  const handleResetFilter = (key, event) => {
    event.stopPropagation();
    const newFilters = { ...filters, [key]: "" };
    setFilters(newFilters);
    console.log(`Reset filter - ${key}`); // Logging reset
    setTimeout(() => handleSearch(newFilters), 0);
  };

  const toggleDropdown = (key) => {
    setOpenDropdown(openDropdown === key ? null : key);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownContainerRef.current && !dropdownContainerRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getButtonLabel = (filter) => {
    if (!filters[filter.key]) return filter.label;
    const option = filter.options.find((opt) => opt.value === filters[filter.key]);
    return option ? option.label : filter.label;
  };

  const isFilterActive = (key) => filters[key] !== "" && filters[key] !== undefined;

  const handleCloseDropdown = (e) => {
    e.stopPropagation();
    setOpenDropdown(null);
  };

  return (
    <div className="quick-filter-dropdowns-container" ref={dropdownContainerRef}>
      {filterOptions.map((filter) => (
        <div key={filter.key} className="quick-filter-dropdown">
          <button
            className={`dropdown-button ${isFilterActive(filter.key) ? 'active' : ''}`}
            onClick={() => toggleDropdown(filter.key)}
          >
            {getButtonLabel(filter)}
            {isFilterActive(filter.key) && (
              <span
                className="filter-reset-button"
                onClick={(e) => handleResetFilter(filter.key, e)}
                title="Clear filter"
              >
                ×
              </span>
            )}
          </button>
          {openDropdown === filter.key && (
            <div className="dropdown-menu">
              <div className="dropdown-header">
                <span>{filter.label}</span>
                <button className="dropdown-close-button" onClick={handleCloseDropdown}>
                  ×
                </button>
              </div>
              <div className="dropdown-options">
                {filter.options.map((option) => (
                  <div
                    key={option.value}
                    className={`dropdown-item ${filters[filter.key] === option.value ? 'selected' : ''}`}
                    onClick={() => handleDropdownChange(filter.key, option.value)}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default QuickFilterDropdowns;