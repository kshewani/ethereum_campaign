import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react';
import campaignFactory from '../ethereum/campaignfactory';
import Layout from '../components/Layout';
import { Link } from '../routes';

export async function getServerSideProps(context) {
  const campaigns = await campaignFactory.methods.getDeployedCampaigns().call();
  return { props: { campaigns } }
}

class CampaignIndex extends Component {
  // static async getInitialProps() {
  //   const campaigns = await campaignFactory.methods.getDeployedCampaigns().call();
  //   return { campaigns }
  // }
  
  render() {
    return  <Layout>
              <div>
                <h3>Open Campaigns</h3>
                <Link route='/campaigns/new'>
                  <a>
                    <Button 
                      floated="right"
                      content="Create Campaign"
                      icon="add"
                      primary
                    />
                  </a>
                </Link>
                {this.renderCampaigns()}
              </div>
            </Layout>
  }

  renderCampaigns() {
    const items = this.props.campaigns.map(address => {
      return {
        header: address,
        description: (
          <Link route={`/campaigns/${address}`}>
            <a>View campaign</a>
          </Link>
        ),
        fluid: true
      };
    });

    return <Card.Group items={items} />
  }
}

export default CampaignIndex;

// export default () => {
//     return (
//         <h1>This is the campaign list page!!!</h1>
//     );
// }