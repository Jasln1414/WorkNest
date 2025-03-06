import {jwtDecode} from "jwt-decode";
import axios from 'axios'

const updateUserToken = async () => {
    console.log('Attempting to update token...');
    const refreshToken = localStorage.getItem("refresh");
    const baseURL = "http://127.0.0.1:8000";

    if (!refreshToken) {
        console.error('No refresh token available');
        return {'name': null, 'isAuthenticated': false};
    }

    try {
        console.log('Sending refresh token request');
        const res = await axios.post(`${baseURL}/api/account/token/refresh/`, {
            'refresh': refreshToken
        });

        console.log('Token Refresh Response:', res);

        if(res.status === 200){
            localStorage.setItem('access', res.data.access);
            localStorage.setItem('refresh', res.data.refresh);
            
            let decoded = jwtDecode(res.data.access);
            console.log('Token Refreshed Successfully', decoded);

            return {
                'name': decoded.name || 'User',
                'isAuthenticated': true
            };
        }
    } catch (error) {
        console.error('Token Refresh Failed:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
    }
    
    return {'name': null, 'isAuthenticated': false};
}

const isAuthUser = async () => {
    console.log('Starting authentication check...');
    const accessToken = localStorage.getItem("access");
    const refreshToken = localStorage.getItem("refresh");

    console.log('Stored Tokens:', {
        access: !!accessToken,
        refresh: !!refreshToken
    });

    if (!accessToken || !refreshToken) {
        console.warn('No tokens found');
        return {'name': null, 'isAuthenticated': false};
    }

    try {
        const currentTime = Date.now() / 1000;
        let decoded = jwtDecode(accessToken);

        console.log('Token Decode Details:', {
            name: decoded.name,
            exp: new Date(decoded.exp * 1000),
            current: new Date(),
            isExpired: decoded.exp <= currentTime
        });

        if (decoded.exp > currentTime) {
            return {
                'name': decoded.name || 'User', 
                'isAuthenticated': true
            };
        }

        console.log('Token expired, attempting refresh');
        return await updateUserToken();

    } catch (error) {
        console.error('Authentication Check Detailed Error:', {
            message: error.message,
            name: error.name,
            stack: error.stack
        });
        
        // Attempt token refresh on decoding error
        if (error instanceof Error) {
            return await updateUserToken();
        }

        return {'name': null, 'isAuthenticated': false};
    }
}

export default isAuthUser;