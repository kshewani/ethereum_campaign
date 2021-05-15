import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const campaignFactory = new web3.eth.Contract(
    CampaignFactory.abi,
    '0xB5Fcd9f11765db34973bfd83fF2045f07043d446'
);

export default campaignFactory;