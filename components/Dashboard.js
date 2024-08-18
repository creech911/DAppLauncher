import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [dApps, setDApps] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(process.env.REACT_APP_DAPPS_ENDPOINT);
        setDApps(result.data);
      } catch (error) {
        console.error("Error fetching DApps data:", error);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="dashboard">
      <h1>Deployed DApps Dashboard</h1>
      <ul>
        {dApps.map((dApp) => (
        <li key={dApp.id}>
            <h2>{dApp.name}</h2>
            <p>Status: {dApp.status}</p>
            <p>Metrics:</p>
            <ul>
              <li>Usage: {dApp.metrics.usage}</li>
              <li>Performance: {dApp.metrics.performance}</li>
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;