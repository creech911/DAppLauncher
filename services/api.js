import axios from 'axios';
class DAppService {
  constructor() {
    this.apiUrl = process.env.REACT_APP_API_URL;
    this.authToken = localStorage.getItem('authToken');
  }
  setHeaders() {
    return {
      headers: {
        Authorization: `Bearer ${this.authToken}`,
      },
    };
  }
  async deployDApp(deploymentData) {
    try {
      const response = await axios.post(`${this.apiUrl}/deploy`, deploymentData, this.setHeaders());
      return response.data;
    } catch (error) {
      throw Error(error.response.data.message);
    }
  }
  async getDeploymentStatus(deploymentId) {
    try {
      const response = await axios.get(`${this.apiUrl}/deploy/${deploymentId}`, this.setHeaders());
      return response.data;
    } catch (error) {
      throw Error(error.response.data.message);
    }
  }
  async login(userData) {
    try {
      const response = await axios.post(`${this.apiUrl}/login`, userData);
      if (response.data.authToken) {
        localStorage.setItem('authToken', response.data.authToken);
        this.authToken = response.data.authToken;
      }
      return response.data;
    } catch (error) {
      throw Error(error.response.data.message);
    }
  }
  logout() {
    localStorage.removeItem('authToken');
    this.authToken = null;
  }
  async register(userData) {
    try {
      const response = await axios.post(`${this.apiUrl}/register`, userData);
      return response.data;
    } catch (error) {
      throw Error(error.response.data.message);
    }
  }
}
export default new DAppService();