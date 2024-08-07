import axios from "axios";
import { Navigate } from "react-router-dom";

const instance = axios.create({
  baseURL: 'https://localhost:7243/api/'
  // baseURL: 'http://10.0.22.27:1437/api',
  // baseURL: 'http://5.180.81.184:1134/api'
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


instance.interceptors.response.use(function (response) {

  return response;
}, function (error) {
  if(error.response.status===401){
    localStorage.removeItem("token")
    localStorage.removeItem("data")
    Navigate('/login/')
  }
  return Promise.reject(error);
});


export default instance;
