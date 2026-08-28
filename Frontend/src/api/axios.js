import axios from "axios";

const api = axios.create({
    baseURL: "https://asset-management-system-1-fvir.onrender.com/api"
});


// ==========================================
// ADD JWT TOKEN TO EVERY REQUEST
// ==========================================

api.interceptors.request.use(
    (config) => {

        const token = localStorage.getItem("token");

        console.log("Token being sent:", token);

        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);


export default api;