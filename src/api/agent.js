import axios from "axios";

const instance = axios.create({
  baseURL: 'http://5.180.81.184:1134/api/',
});

instance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
