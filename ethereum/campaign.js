import web3 from './web3';
import CampaignJson from './build/Campaign.json';

// const Campaign = (address) => {
//     return new web3.eth.Contract(CampaignJson.abi, address);
// }

// export default Campaign;

export default (address) => {
    return new web3.eth.Contract(
        CampaignJson.abi,
        address
    )
};
