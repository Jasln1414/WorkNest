import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import '../../../Styles/FindJob.css'
function JobCard(props) {
  const baseURL = 'http://127.0.0.1:8000';
  const image = `${baseURL}${props.img}`;

  // Log the posted date for debugging
  console.log('Posted Date:', props.posted);

  // Validate and format the posted date
  const isValidDate = props.posted && !isNaN(new Date(props.posted).getTime());
  const postdate = isValidDate ? new Date(props.posted) : null;
  console.log('Job ID:', props.id);

  return (
    <div className="job-card">
      {/* Apply Before */}
      <div className="apply-before">
        Apply Before: {props.applybefore}
      </div>

      {/* Posted Date */}
      <div className="posted-date">
        {isValidDate
          ? formatDistanceToNow(postdate, { addSuffix: true })
              .replace('about ', '')
              .replace('hours', 'hr')
          : 'Date unavailable'}
      </div>

      {/* Company Logo */}
      <div className="company-logo">
        <img src={image} alt="" />
      </div>

      {/* Job Details */}
      <div className="job-details">
        <div>
        <Link to={`/employer/postjob/job/${props.id}`}>
       
  

            <p className="job-title">{props.title}</p>
          </Link>
         
          <p className="employer-name">{props.empname}</p>
        </div>

        {/* Job Posted and Location */}
        <div className="job-info">
          <div className="job-info-item job-posted">
            Job Posted:
            <span>{isValidDate ? postdate.toLocaleDateString() : 'N/A'}</span>
          </div>
          <div className="job-info-item location">
            Location:
            <span>{props.location}</span>
          </div>
        </div>

        {/* Experience and Salary */}
        <div className="experience-salary">
          <div className="job-info-item experience">
            Experience:
            <span>{props.experience}</span>
          </div>
          <div className="job-info-item salary">
            Salary:
            <span>{props.salary} lpa</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobCard;