import { jwtDecode } from "jwt-decode";
import axios from 'axios';

// Define the base URL with a fallback
const baseURL = import.meta.env.VITE_API_BASEURL || 'http://127.0.0.1:8000';

// Function to update the access token using the refresh token
const updateUserToken = async () => {
    const refreshToken = localStorage.getItem("refresh");

    if (!refreshToken) {
        console.error("Refresh token not found in local storage.");
        return { name: null, isAuthenticated: false };
    }

    try {
        const response = await axios.post(`${baseURL}/api/account/token/refresh/`, {
            refresh: refreshToken,
        });

        if (response.status === 200) {
            // Update the access and refresh tokens in local storage
            localStorage.setItem('access', response.data.access);
            localStorage.setItem('refresh', response.data.refresh);

            // Decode the new access token to get user details
            const decoded = jwtDecode(response.data.access);
            return { name: decoded.name, isAuthenticated: true };
        } else {
            console.error("Failed to refresh token: Invalid response status.");
            return { name: null, isAuthenticated: false };
        }
    } catch (error) {
        console.error("Error refreshing token:", error);
        return { name: null, isAuthenticated: false };
    }
};

// Function to check if the user is authenticated
const isAuthUser = async () => {
    const accessToken = localStorage.getItem("access");

    // If no access token is found, the user is not authenticated
    if (!accessToken) {
        return { name: null, isAuthenticated: false };
    }

    // Decode the access token to check its expiration
    const decoded = jwtDecode(accessToken);
    const currentTime = Date.now() / 1000;

    if (decoded.exp > currentTime) {
        // Token is still valid
        return { name: decoded.name, isAuthenticated: true };
    } else {
        // Token is expired, try to refresh it
        const updateSuccess = await updateUserToken();
        return updateSuccess;
    }
};

export default isAuthUser;