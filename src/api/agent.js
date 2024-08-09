import axios from "axios";
import { Navigate } from "react-router-dom";

const instance = axios.create({
  // baseURL: 'http://91.135.242.233:1437/api'
  baseURL: 'http://localhost:5159/api/'
  // baseURL: 'http://5.180.81.184:1134/api'
  // baseURL: 'http://10.0.22.27:1437/api'
  // baseURL: 'http://10.130.1.5:1701/api/' 
  // baseURL: 'http://108.143.78.215:1701/api/' 
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
