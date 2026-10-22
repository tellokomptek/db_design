import axios from 'axios';

const API = axios.create({
  baseURL: 'http://192.168.0.52:8001/api', // Ganti langsung dengan IP server Anda
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export default API;