import { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const useJobData = (baseURL) => {
  const [jobData, setJobData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobData = async () => {
      const token = localStorage.getItem('access');

      if (!token) {
        setError('No authentication token found. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          setError('Your session has expired. Please log in again.');
          localStorage.removeItem('access');
          window.location.href = '/';
          return;
        }
      } catch (error) {
        setError('Invalid token. Please log in again.');
        localStorage.removeItem('access');
        window.location.href = '/';
        return;
      }

      try {
        const headers = {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        };

        const response = await axios.get(baseURL + 'api/empjob/getAlljobs/', { headers });

        if (response.status === 200) {
          setJobData(response.data);
          setError(null);
        } else {
          setError('Failed to fetch job data. Please try again later.');
        }
      } catch (error) {
        console.error('Error fetching job data:', error);
        if (error.response) {
          if (error.response.status === 401) {
            setError('Your session has expired. Please log in again.');
            localStorage.removeItem('access');
            window.location.href = '/login';
          } else if (error.response.status === 404) {
            setError('The requested resource was not found. Please check the API endpoint.');
          } else {
            setError('An error occurred while fetching job data. Please try again later.');
          }
        } else if (error.request) {
          setError('No response received from the server. Please check your network connection.');
        } else {
          setError('An unexpected error occurred. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchJobData();
  }, [baseURL]);

  return { jobData, error, loading };
};

export default useJobData;