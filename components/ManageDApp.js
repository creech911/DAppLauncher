import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import contract from '@truffle/contract';

import CONTRACT_ABI from './YOUR_CONTRACT_ABI.json';
const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;

const DApp = () => {
  const [web3, setWeb3] = useState(undefined);
  const [ContractInstance, setContractInstance] = useState(undefined);
  const [accounts, setAccounts] = useState([]);
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          const web3Instance = new Web3(window.ethereum);
          await window.ethereum.enable();
          const deployedContract = contract({
            abi: CONTRACT_ABI,
          });
          deployedContract.setProvider(web3Instance.currentProvider);
          
          const accounts = await web3Instance.eth.getAccounts();
          const instance = await deployedContract.at(CONTRACT_ADDRESS);
          
          setWeb3(web3Instance);
          setContractInstance(instance);
          setAccounts(accounts);
        } catch (error) {
          console.error("Error initializing web3:", error);
        }
      } else {
        console.log('Ethereum wallet not detected');
      }
    };
    init();
  }, []);

  const performAction = async () => {
    if (ContractInstance && accounts.length > 0) {
      setIsLoading(true);
      try {
        const response = await ContractInstance.methods.methodName().send({ from: accounts[0] });
        console.log('Transaction response:', response);
        setStatus('Transaction successful');
      } catch (error) {
        console.error('Error sending transaction:', error);
        setStatus('Transaction failed');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div>
      <h2>DApp Management</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <p>Status: {status}</p>
          <button onClick={performAction}>Perform Action</button>
        </>
      )}
    </div>
  );
};

export default DApp;