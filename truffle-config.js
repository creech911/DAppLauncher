module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    },
    rinkeby: {
      provider: () => new HDWalletProvider(
        process.env.MNEMONIC,
        `https://rinkeby.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
      ),
      network_id: 4,
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
  },

  mocha: {},

  compilers: {
    solc: {
      version: "0.8.0",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        },
        evmVersion: "byzantium"
      }
    }
  },

  db: {
    enabled: false
  }
};
