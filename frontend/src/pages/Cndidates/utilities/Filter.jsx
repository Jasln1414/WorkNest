import React, { useState, useEffect, useRef } from 'react';
import '../../../Styles/USER/Search.css';

const QuickFilterDropdowns = ({ filters, setFilters, handleSearch }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownContainerRef = useRef(null);

  const filterOptions = [
    {
      key: "jobMode",
      label: "Job Mode",
      options: [
        { label: "Any Mode", value: "" },
        { label: "Remote", value: "Remote" },
        { label: "On Site", value: "On Site" },
        { label: "Hybrid", value: "Hybrid" },
      ],
    },
    {
      key: "jobType",
      label: "Job Type",
      options: [
        { label: "Any Type", value: "" },
        { label: "Full Time", value: "Full Time" },
        { label: "Part Time", value: "Part Time" },
        { label: "Contract", value: "Contract" },
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
      key: "salaryRange",
      label: "Salary Range",
      options: [
        { label: "Any Salary", value: "" },
        { label: "0 - 3 LPA", value: "0-3" },
        { label: "3 - 6 LPA", value: "3-6" },
        { label: "6 - 10 LPA", value: "6-10" },
        { label: "10+ LPA", value: "10-0" },
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

  // Handle dropdown selection
  const handleDropdownChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Trigger search immediately
    setTimeout(() => {
      handleSearch();
    }, 0);
    
    // Close the dropdown after selection
    setOpenDropdown(null);
  };

  // Handle reset for individual filter
  const handleResetFilter = (key, event) => {
    event.stopPropagation(); // Stop event propagation
    const newFilters = { ...filters, [key]: "" };
    setFilters(newFilters);
    
    // Trigger search immediately
    setTimeout(() => {
      handleSearch();
    }, 0);
  };

  // Toggle dropdown open/close
  const toggleDropdown = (key) => {
    setOpenDropdown(openDropdown === key ? null : key);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownContainerRef.current &&
        !dropdownContainerRef.current.contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get appropriate label to display on the button
  const getButtonLabel = (filter) => {
    if (!filters[filter.key]) {
      return filter.label;
    }
    const option = filter.options.find((opt) => opt.value === filters[filter.key]);
    return option ? option.label : filter.label;
  };

  // Check if a filter has an active selection
  const isFilterActive = (key) => {
    return filters[key] !== "" && filters[key] !== undefined;
  };

  // Close dropdown only
  const handleCloseDropdown = (e) => {
    e.stopPropagation(); // Stop event propagation
    setOpenDropdown(null); // Close the dropdown
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
                <button
                  className="dropdown-close-button"
                  onClick={handleCloseDropdown}
                >
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