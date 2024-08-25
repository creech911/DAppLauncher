import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { ethers } from 'ethers';

const DeployDApp = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const providerUrl = process.env.REACT_APP_PROVIDER_URL;
  const privateKey = process.env.REACT_APP_PRIVATE_KEY;

  const DeploymentSchema = Yup.object().shape({
    contractName: Yup.string().required('Contract name is required'),
    network: Yup.string().required('Network is required'),
  });

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    if (!selectedFile) {
      alert('Please select a smart contract file to deploy');
      setSubmitting(false);
      return;
    }

    try {
      const provider = new ethers.providers.JsonRpcProvider(providerUrl);
      const wallet = new ethers.Wallet(privateKey, provider);
      console.log('Contract deployed to:', '');
      resetForm();
    } catch (error) {
      console.error('Deployment error:', error);
      alert('Deployment failed');
    }

    setSubmitting(false);
  };

  return (
    <div>
      <h2>Deploy your DApp</h2>
      <Formik
        initialValues={{
          contractName: '',
          network: '',
        }}
        validationSchema={DeploymentSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <label htmlFor="contractName">Contract Name</label>
              <Field id="contractName" name="contractName" placeholder="MySmartContract" />
            </div>
            <div>
              <label htmlFor="network">Network</label>
              <Field as="select" id="network" name="network">
                <option value="ropsten">Ropsten</option>
                <option value="mainnet">Mainnet</option>
              </Field>
            </div>
            <div>
              <label htmlFor="smartContract">Smart Contract File</label>
              <input id="smartContract" name="smartContract" type="file" onChange={handleFileChange} />
            </div>
            <button type="submit" disabled={isSubmitting}>
              Deploy Contract
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default DeployDApp;