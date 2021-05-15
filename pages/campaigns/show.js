import React, { Component } from 'react';
import { Card, Grid, Button } from 'semantic-ui-react';
import Layout from '../../components/Layout'
import Campaign from '../../ethereum/campaign'
import web3 from '../../ethereum/web3';
import ContributeForm from '../../components/ContributeForm';
import { Link } from '../../routes';

export async function getServerSideProps(props) {
    const address = props.query.address;
    const campaign = Campaign(address);
    const summary = await campaign.methods.getSummary().call();

    return { props: { 
        address: address,
        minimumContribution: summary[0],
        balance: summary[1],
        requestsCount: summary[2],
        approversCount: summary[3],
        manager: summary[4]
     } }
}

class CampaignShow extends Component {
    render() {
        return (
            <Layout>
                <h3>Campaigns show</h3>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={10}>
                            {this.renderCampaigns()}
                        </Grid.Column>
                        <Grid.Column width={6}>
                            <ContributeForm address={ this.props.address } />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Link route={`/campaigns/${this.props.address}/requests`}>
                                <a>
                                    <Button primary>
                                        View Requests
                                    </Button>
                                </a>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>
        )
    }

    renderCampaigns() {
        const {
            address,
            minimumContribution,
            balance,
            requestsCount,
            approversCount,
            manager
        } = this.props;

        const items = [
            {
                header: address,
                meta: 'Campaign\'s address',
                description: 'Address of the campaign contract',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: manager,
                meta: 'Manager\'s Address',
                description: 'The manager created this campaign and can create requests to withdraw money',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: minimumContribution,
                meta: 'Minimum Contribution (wei)',
                description: 'You must contribute atlease this much wei to become an approver'
            },
            {
                header: requestsCount,
                meta: 'Number of requests',
                description: 'A request tries to withdraw money from the contract. A request must be approved by approvers'
            },
            {
                header: approversCount,
                meta: 'Number of approvers',
                description: 'Number of approvers who have already donated for this campaign'
            },
            {
                header: web3.utils.fromWei(balance, 'ether'),
                meta: 'Campaign Balance (ether)',
                description: 'The amount of money campaign is left to spend'
            }
        ];

        return <Card.Group items={items} />;
    }
}

export default CampaignShow;