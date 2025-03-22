import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import axios from 'axios';
import Swal from 'sweetalert2';
import SideBar from '../SideBar';
import JobDetailModal from '../../../Components/Employer/Employjobdetail';

// Configure axios defaults for CSRF
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

function JobDetail() {
  const baseURL = 'http://127.0.0.1:8000';
  const token = localStorage.getItem('access');
  const { jobId } = useParams();
  const [jobData, setJobData] = useState({});
  const [status, setStatus] = useState(false);
  const [modal, setModal] = useState(false);

  // Fetch job data
  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/empjob/getjobs/detail/${jobId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setJobData(response.data);
          setStatus(response.data.active);
        }
      } catch (error) {
        console.error('Error fetching job data:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch job details. Please try again later.',
        });
      }
    };

    if (token && jobId) {
      fetchJobData();
    }
  }, [jobId, token, baseURL]);

  // Handle job status change
  const handleJobStatusChange = async (action) => {
    try {
      const isActivating = action === 'activate';
      const response = await axios.post(
        `${baseURL}/api/empjob/getjobs/status/${jobId}/`,
        { active: isActivating },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setStatus(isActivating);
        Swal.fire({
          icon: 'success',
          title: isActivating ? 'Activated' : 'Deactivated',
          text: `The job has been successfully ${action}d.`,
        });
      }
    } catch (error) {
      console.error('Error updating job status:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update job status. Please try again later.',
      });
    }
  };

  // Handle deactivate
  const handleDeactivate = () => {
    Swal.fire({
      title: 'Do you want to deactivate this job?',
      showDenyButton: true,
      confirmButtonText: 'Deactivate',
      denyButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        handleJobStatusChange('deactivate');
      }
    });
  };

  // Handle activate
  const handleActivate = () => {
    Swal.fire({
      title: 'Do you want to activate this job?',
      showDenyButton: true,
      confirmButtonText: 'Activate',
      denyButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        handleJobStatusChange('activate');
      }
    });
  };

  // CSS for responsive layout
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
    },
    contentWrapper: {
      flex: 1,
      padding: '1rem',
      display: 'flex',
      justifyContent: 'center',
    },
    formContainer: {
      width: '100%',
      maxWidth: '900px',
      margin: '0 auto',
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '1.5rem',
      textAlign: 'center',
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      padding: '1.5rem',
    },
    jobTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      marginBottom: '1rem',
      textAlign: 'center',
    },
    detailsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '1.5rem',
      marginBottom: '1.5rem',
    },
    detailItem: {
      marginBottom: '1rem',
      paddingBottom: '0.5rem',
      borderBottom: '1px solid #e5e7eb',
    },
    label: {
      fontWeight: '500',
      marginRight: '0.5rem',
    },
    activeText: {
      color: '#10b981',
      marginLeft: '0.5rem',
    },
    inactiveText: {
      color: '#ef4444',
      marginLeft: '0.5rem',
    },
    section: {
      marginTop: '1.5rem',
      padding: '1rem',
      backgroundColor: '#f9fafb',
      borderRadius: '0.25rem',
      border: '1px solid #e5e7eb',
    },
    sectionTitle: {
      fontWeight: '500',
      paddingBottom: '0.5rem',
      borderBottom: '1px solid #e5e7eb',
      marginBottom: '0.5rem',
    },
    sectionText: {
      color: '#4b5563',
    },
    buttonGroup: {
      marginTop: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.75rem',
    },
    button: {
      padding: '0.5rem 1rem',
      borderRadius: '0.25rem',
      fontWeight: '500',
      cursor: 'pointer',
      border: 'none',
      width: '100%',
      maxWidth: '200px',
    },
    editButton: {
      backgroundColor: '#3b82f6',
      color: 'white',
    },
    deactivateButton: {
      backgroundColor: '#ef4444',
      color: 'white',
    },
    activateButton: {
      backgroundColor: '#10b981',
      color: 'white',
    },
    '@media (min-width: 768px)': {
      container: {
        flexDirection: 'row',
      },
      buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'center',
      },
    },
  };

  // Apply media query styles for larger screens
  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    const handleChange = (e) => {
      if (e.matches) {
        document.getElementById('job-container').style.flexDirection = 'row';
        document.getElementById('button-group').style.flexDirection = 'row';
      } else {
        document.getElementById('job-container').style.flexDirection = 'column';
        document.getElementById('button-group').style.flexDirection = 'column';
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    handleChange(mediaQuery);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <div id="job-container" style={styles.container}>
      <SideBar />

      <div style={styles.contentWrapper}>
        {modal && <JobDetailModal setModal={setModal} jobData={jobData} />}
        
        <div style={styles.formContainer}>
          <h1 style={styles.title}>Job Details</h1>
          
          <Formik
            initialValues={jobData}
            enableReinitialize
          >
            {() => (
              <Form style={styles.card}>
                <h2 style={styles.jobTitle}>{jobData?.title}</h2>
                
                <div style={styles.detailsGrid}>
                  <div>
                    <div style={styles.detailItem}>
                      <span style={styles.label}>Location:</span>
                      <Field name="location" disabled component="span">
                        {jobData?.location}
                      </Field>
                    </div>
                    <div style={styles.detailItem}>
                      <span style={styles.label}>Salary:</span>
                      <Field name="lpa" disabled component="span">
                        {jobData?.lpa} LPA
                      </Field>
                    </div>
                    <div style={styles.detailItem}>
                      <span style={styles.label}>Job Type:</span>
                      <Field name="jobtype" disabled component="span">
                        {jobData?.jobtype}
                      </Field>
                    </div>
                    <div style={styles.detailItem}>
                      <span style={styles.label}>Job Mode:</span>
                      <Field name="jobmode" disabled component="span">
                        {jobData?.jobmode}
                      </Field>
                    </div>
                  </div>
                  
                  <div>
                    <div style={styles.detailItem}>
                      <span style={styles.label}>Experience:</span>
                      <Field name="experience" disabled component="span">
                        {jobData?.experience}
                      </Field>
                    </div>
                    <div style={styles.detailItem}>
                      <span style={styles.label}>Date Posted:</span>
                      <Field name="postedDate" disabled component="span">
                        {jobData?.postedDate}
                      </Field>
                    </div>
                    <div style={styles.detailItem}>
                      <span style={styles.label}>Apply Before:</span>
                      <Field name="applyBefore" disabled component="span">
                        {jobData?.applyBefore}
                      </Field>
                    </div>
                    <div style={styles.detailItem}>
                      <span style={styles.label}>Status:</span>
                      <Field name="status" disabled component="span">
                        {status ? (
                          <span style={styles.activeText}>Active</span>
                        ) : (
                          <span style={styles.inactiveText}>Expired</span>
                        )}
                      </Field>
                    </div>
                  </div>
                </div>

                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}>About Job:</h3>
                  <p style={styles.sectionText}>{jobData?.about}</p>
                </div>

                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}>Responsibilities:</h3>
                  <p style={styles.sectionText}>{jobData?.responsibility}</p>
                </div>

                <div id="button-group" style={styles.buttonGroup}>
                  <button
                    type="button"
                    onClick={() => setModal(true)}
                    style={{...styles.button, ...styles.editButton}}
                  >
                    Edit
                  </button>
                  {status ? (
                    <button
                      type="button"
                      onClick={handleDeactivate}
                      style={{...styles.button, ...styles.deactivateButton}}
                    >
                      Deactivate
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleActivate}
                      style={{...styles.button, ...styles.activateButton}}
                    >
                      Activate
                    </button>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default JobDetail;