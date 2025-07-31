import axios from "axios";

const production = false;

const axiosInstance = axios.create({
  baseURL: production
    ? "https://stock-management-server-seven.vercel.app/api/v1"
    : "http://localhost:5000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
