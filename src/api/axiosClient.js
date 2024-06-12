import axios from "axios";

const http = 'http://localhost:3000';

const axiosClient = axios.create({
    baseURL: http,
    headers: {
        "Content-Type": 'application/json',
    }
});

axiosClient.interceptors.request.use(function (config) {

    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, function (error) {

    return Promise.reject(error);
});

axiosClient.interceptors.response.use(function (response) {

    return response;
}, function (error) {

    return Promise.reject(error);
});

export default axiosClient;
