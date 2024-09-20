import axios, { AxiosInstance } from "axios";

const axiosClient: AxiosInstance = axios.create({
  baseURL: 'https://api.spacetraders.io/v2/',
  timeout: 5000,
  headers: {
      'Content-Type': 'application/json',
  }
});

export default axiosClient;