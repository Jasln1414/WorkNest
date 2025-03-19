import { formatDistanceToNow } from 'date-fns';

import React from "react";
import { Link } from "react-router-dom";

import "../../../Styles/USER/Home.css";



function JobCard(props) {
  const baseURL = "http://127.0.0.1:8000";
  const image = `${baseURL}${props.img}`;

console.log("Posted Date:", props.posted);
const postDateStr = props.posted || props.posteDate;  // Ensure we check both names
const isValidDate = postDateStr && !isNaN(new Date(postDateStr).getTime());
const postDate = isValidDate ? new Date(postDateStr) : null;
const postedText = isValidDate ? formatDistanceToNow(postDate, { addSuffix: true }) : "N/A";


  
  
  console.log("Posted Date:", props.posted);
  console.log("JobCard Props:", props);


  return (
    <div className="job-card-h1233">
      <div className="job-content-h1233">
        <div className="job-header-h1233">
          <Link to={`/candidate/find-job/job/${props.id}`} className="job-title-h1233">
            <h2 className="job-title-text-h1233">{props.title}</h2>
          </Link>
          <h3 className="employer-name-text-h1233">{props.empname}</h3>
        </div>

        <div className="job-info-h1233">
          <div className="info-item-h1233">
            <span className="info-label-h1233">Posted:</span>
            <span className="info-value-h1233">
              {postedText}
            </span>
          </div>
          <div className="info-item-h1233">
            <span className="info-label-h1233">Location:</span>
            <span className="info-value-h1233">{props.location}</span>
          </div>
        </div>

        {/* Experience & Salary */}
        <div className="job-info-h1233">
          <div className="info-item-h1233">
            <span className="info-label-h1233">Experience:</span>
            <span className="info-value-h1233">{props.experience}</span>
          </div>
          <div className="info-item-h1233">
            <span className="info-label-h1233">Salary:</span>
            <span className="info-value-h1233">{props.salary} LPA</span>
          </div>
        </div>

        {/* Apply Before & Job Type */}
        <div className="job-footer-h1233">
          <span className="apply-before-h1233">Apply Before: {props.applybefore}</span>
          <span className="job-type-h1233">{props.jobtype}</span>
        </div>
      </div>
    </div>
  );
}

export default JobCard;