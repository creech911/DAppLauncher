require('dotenv').config();
const Web3 = require('web3');
const { abi, evm } = require('./YourContract.json');

class EthereumService {
    constructor() {
        if (!EthereumService.instance) {
            this.web3 = new Web3(process.env.INFURA_URL);
            this.account = this.web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
            this.web3.eth.accounts.wallet.add(this.account);
            this.web3.eth.defaultAccount = this.account.address;
            EthereumService.instance = this;
        }

        return EthereumService.instance;
    }

    async deployContract(contractArguments) {
        const contract = new this.web3.eth.Contract(abi);
        const deployOptions = {
            data: evm.bytecode.object,
            arguments: contractArguments,
        };

        const gasEstimate = await contract.deploy(deployOptions).estimateGas();
        const gasPrice = await this.web3.eth.getGasPrice();

        return contract.deploy(deployOptions)
            .send({
                from: this.account.address,
                gas: gasEstimate,
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

    async interactWithContract(contractAddress, methodName, methodArgs = [], call = true) {
        const contract = new this.web3.eth.Contract(abi, contractAddress);

        if (call) {
            return contract.methods[methodName](...methodArgs).call();
        } else {
            const gasEstimate = await contract.methods[methodName](...methodArgs).estimateGas({ from: this.account.address });
            const gasPrice = await this.web3.eth.getGasPrice();
            return contract.methods[methodName](...methodArgs)
                .send({ from: this.account.address, gas: gasEstimate, gasPrice: gasPrice })
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

(async () => {
    const ethereumService = new EthereumService();
    try {
        const deployedContract = await ethereumService.deployContract(['ConstructorArgument1', 'ConstructorArgument2']);
        const data = await ethereumService.interactWithContract(deployedContract.options.address, 'methodName', ['arg1', 'arg2'], true);
        console.log('Method call result:', data);
        const receipt = await ethereumService.interactWithContract(deployedContract.options.address, 'methodName', ['arg1', 'arg2'], false);
        console.log('Transaction receipt:', receipt);
    } catch (error) {
        console.error('Error in Ethereum service:', error);
    }
})();