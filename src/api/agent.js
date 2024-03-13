import axios from "axios";

const token = localStorage.getItem('token')
const instance = axios.create({
    baseURL: 'http://5.180.81.184:1134/api/',
    headers: {Authorization: `Bearer ${token}`}
    
  });



  export default instance;