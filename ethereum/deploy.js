const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/CampaignFactory.json');

// Use a metamask mnemonic which you can afford to share.
// Please please please, do not share your actual mnemonic which can expose your accounts with real money.
const provider = new HDWalletProvider(
    'infant bomb people blur anger horror embrace twin base scout west scrub',
    'https://rinkeby.infura.io/v3/e2f4ae695414428f8eac050c116d858b'
    );
const web3 = new Web3(provider);
let deployedContract;

const deploy = async () => {
    try {
        const accounts = await web3.eth.getAccounts();
        console.log(accounts);
        web3.eth.getBalance(accounts[0]).then(console.log);
        console.log('Attempting to deploy from account: ', accounts[0]);
        deployedContract = await new web3.eth.Contract(compiledFactory.abi)
            .deploy({ data: compiledFactory.evm.bytecode.object })
            .send({ from: accounts[0], gas: '1200000' });

        console.log('Contract deployed to: ', deployedContract.options.address);
        deployedContract.setProvider(provider)
    } catch (err) {
        console.log(err);
    }
}

deploy();