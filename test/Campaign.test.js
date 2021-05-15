const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts, factory, campaignAddress, campaign, manager;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    manager = accounts[0];

    // create Campaign Factory contract
    factory = await new web3.eth.Contract(compiledFactory.abi)
                .deploy({ data: compiledFactory.evm.bytecode.object })
                .send({ from: accounts[0], gas: '1200000' });

    // create Campaign using Campaign Factory
    await factory.methods.createCampaign('120').send({
        from: manager,
        gas: '1000000'
    });

    // get Campaign address from Campaign Facotry
    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
    // above line of code translates to:
    // const addresses = await factory.methods.getDeployedCampaigns().call();
    // campaignAddress = addresses[0];

    // initialize campaign
    campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress);
});

describe('Campaigns', () => {
    it('deploys a factory and a campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('marks caller as the campaign manager', async () => {
        const campaignManager = await campaign.methods.manager().call();
        assert.strictEqual(manager, campaignManager);
    });

    it('allows people to contribute money and marks them as approvers', async () => {
        await campaign.methods.contribute().send({ value: '200', from: accounts[1] })
        const isContributor = await campaign.methods.approvers(accounts[1]).call();
        assert(isContributor);
    });

    it('requires a minimum contribution', async () => {
        try {
            await campaign.methods.contribute().send({ value: '5', from: accounts[1] });
            assert(false);
        } catch (err) {
            assert(err);
        }
    })

    it('allows a manager to create a payment request', async () => {
        await campaign.methods
            .createRequest('Buy chipsets', '100', accounts[1])
            .send({ 
                from: manager,
                gas: '1000000'
            });
        
        const request = await campaign.methods.requests(0).call();
        assert.strictEqual('Buy chipsets', request.description);
    })

    it('processes request', async () => {
        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei('10', 'ether')
        });

        let balanceBefore = await web3.eth.getBalance(accounts[1]);
        balanceBefore = web3.utils.fromWei(balanceBefore, 'ether');
        balanceBefore = parseFloat(balanceBefore);

        await campaign.methods
            .createRequest('Buy batteries', web3.utils.toWei('5', 'ether'), accounts[1])
            .send({ from:accounts[0], gas: '1000000' });
        
        await campaign.methods.approveRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        let balanceAfter = await web3.eth.getBalance(accounts[1]);
        balanceAfter = web3.utils.fromWei(balanceAfter, 'ether');
        balanceAfter = parseFloat(balanceAfter);

        assert(balanceAfter > balanceBefore);
    });
});