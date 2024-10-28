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
      console.log('Deploy DApp response:', response);
      return response.data;
    } catch (error) {
      console.error('Error deploying DApp:', error.message);
      throw Error(error.response.data.message);
    }
  }

  async getDeploymentStatus(deploymentId) {
    try {
      const response = await axios.get(`${this.apiUrl}/deploy/${deploymentId}`, this.setHeaders());
      console.log(`Deployment status for ${deploymentId}:`, response);
      return response.data;
    } catch (error) {
      console.error(`Error getting deployment status for ${deploymentId}:`, error.message);
      throw Error(error.response.data.message);
    }
  }

  async login(userData) {
    try {
      const response = await axios.post(`${this.apiUrl}/login`, userData);
      if (response.data.authToken) {
        localStorage.setItem('authToken', response.data.authToken);
        this.authToken = response.data.authToken;
        console.log('Login successful:', response);
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error.message);
      throw Error(error.response.data.message);
    }
  }

  logout() {
    localStorage.removeItem('authToken');
    this.authToken = null;
    console.log('Logout successful');
  }

  async register(userData) {
    try {
      const response = await axios.post(`${this.apiUrl}/register`, userData);
      console.log('Registration successful:', response);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error.message);
      throw Error(error.response.data.message);
    }
  }
}

export default new DAppService();