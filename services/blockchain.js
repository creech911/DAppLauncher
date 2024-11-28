require('dotenv').config();
const Web3 = require('web3');
const { abi, evm } = require('./YourContract.json'); // Assuming ABI and bytecode are exported from this JSON file

class EthereumService {
    constructor() {
        this.web3 = new Web3(process.env.INFURA_URL); // Or your preferred provider
        this.account = this.web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
        this.web3.eth.accounts.wallet.add(this.account);
        this.web3.eth.defaultAccount = this.account.address;
    }

    // Function to deploy a new contract
    async deployContract(contractArguments) {
        const contract = new this.web3.eth.Contract(abi);
        const deployOptions = {
            data: evm.bytecode.object,
            arguments: contractArguments,
        };

        const gas = await contract.deploy(deployOptions).estimateGas();
        const gasPrice = await this.web3.eth.getGasPrice();

        return contract.deploy(deployOptions)
            .send({
                from: this.account.address,
                gas: gas,
                gasPrice: gasPrice,
            })
            .then(deployment => {
                console.log('Contract deployed at address:', deployment.options.address);
                return deployment;
            })
            .catch(err => {
                console.error('Deployment error:', err);
                throw err;
            });
    }

    // Function to interact with a deployed contract
    async interactWithContract(contractAddress, methodName, methodArgs = [], call = true) {
        const contract = new this.web3.eth.Contract(abi, contractAddress);
        if (call) {
            // Call: for methods that don't alter the blockchain state
            return contract.methods[methodName](...methodArgs).call();
        } else {
            // Send: for transactions that alter the blockchain state
            const gas = await contract.methods[methodName](...methodArgs).estimateGas({ from: this.account.address });
            const gasPrice = await this.web3.eth.getGasPrice();
            return contract.methods[methodName](...methodArgs)
                .send({ from: this.account.address, gas, gasPrice })
                .then(receipt => {
                    console.log('Transaction receipt:', receipt);
                    return receipt;
                })
                .catch(err => {
                    console.error('Transaction error:', err);
                    throw err;
                });
        }
    }

    // Function to get data from the blockchain
    async getBlockchainData(callFunction) {
        return callFunction()
            .then(data => {
                console.log('Blockchain data:', data);
                return data;
            })
            .catch(err => {
                console.error('Error retrieving blockchain data:', err);
                throw err;
            });
    }
}

// Example usage - put your contract's details and desired calls
(async () => {
    const ethereumService = new EthereumService();
    try {
        // Deploy a contract (if needed)
        const deployedContract = await ethereumService.deployContract(['ConstructorArgument1', 'ConstructorArgument2']);

        // Interact with a contract (call method)
        const data = await ethereumService.interactWithContract(deployedContract.options.address, 'methodName', ['arg1', 'arg2'], true);
        console.log('Method call result:', data);

        // Interact with a contract (send transaction)
        const receipt = await ethereumService.interactWithContract(deployedContract.options.address, 'methodName', ['arg1', 'arg2'], false);
        console.log('Transaction receipt:', receipt);
    } catch (error) {
        console.error('Error in Ethereum service:', error);
    }
})();
