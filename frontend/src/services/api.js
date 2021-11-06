import axios from 'axios';

const api = axios.create({
  //http://localhost:3344
  baseURL: 'https://ia8puzzle-server.herokuapp.com'
});

export default api;