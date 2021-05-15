import React, { Component } from 'react';;
import { Button, Grid, Table } from 'semantic-ui-react';
import { Link } from '../../../routes';
import Layout from '../../../components/Layout';
import Campaign from '../../../ethereum/campaign';
import RequestRow from '../../../components/RequestRow';

export async function getServerSideProps(props) {
    const address = props.query.address;
    const campaign = Campaign(address);
    const requestsCount = await campaign.methods.getRequestsCount().call();
    const approversCount = await campaign.methods.approversCount().call();
    // console.log('RequestsCount: ' + requestsCount);
    
    // const requests = await campaign.methods.requests(1).call();
    // console.log(requests);
    // const requests = await Promise.all(
    //     Array(requestsCount).fill().map((element, index) => {
    //         return campaign.methods.requests(index).call()
    //     })
    // );

    let requests = [];

    for(let index=0; index<requestsCount; index++) {
        const request = await campaign.methods.requests(index).call();
        // console.log('Index:' + index);
        requests.push(request);
    }
    
    // const requests = await Promise.all(
    //     new Array(requestsCount).fill().map(async (element, index) => {
    //         const request = await campaign.methods.requests(index).call();
    //         console.log('Index:' + index);
    //         return request;
    //     })
    // );

    //console.log(requests);
    return { props: { address, requests: JSON.stringify(requests), requestsCount, approversCount } }
}

class RequestIndex extends Component {
    renderRows() {
        const requests = JSON.parse(this.props.requests);
        console.log(requests.length);
        // requests.map((request, index) => {
        //     console.log('Index: '+index);
        //     console.log('request: '+request.toString());
        //     console.log('address: '+this.props.address);
        // })

        const requestRows = [];
        for(let index=0; index<requests.length; index++) {
            requestRows.push(
                <RequestRow
                    key={index}
                    id={index}
                    request={requests[index]}
                    address={this.props.address}
                    approversCount = {this.props.approversCount}
                />)
        }
        return requestRows;

        return requests.map((request, index) => {
            <RequestRow 
             key={index}
             id={index}
             request={request}
             address={this.props.address}
            />
        })

        // return this.props.requests;

        // return this.props.requests.map((request, index) => {
        //     return <RequestRow 
        //     key={index}
        //     request={request}
        //     address={this.props.address}
        //     />
        // })
    }

    render() {
        const { Header, Row, HeaderCell, Body } = Table;
        return(
            <Layout>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={2} verticalAlign='middle'>
                            <h3>Requests</h3>
                        </Grid.Column>
                        <Grid.Column width={14}>
                            <Link route={`/campaigns/${this.props.address}/requests/new`}>
                                <a>
                                    <Button primary floated='right' style={{ marginBottom: 10 }}>Add Request</Button>
                                </a>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Table>
                            <Header>
                                <Row>
                                    <HeaderCell>Id</HeaderCell>
                                    <HeaderCell>Description</HeaderCell>
                                    <HeaderCell>Amount</HeaderCell>
                                    <HeaderCell>Recipient</HeaderCell>
                                    <HeaderCell>Approval Count</HeaderCell>
                                    <HeaderCell>Approve</HeaderCell>
                                    <HeaderCell>Finalize</HeaderCell>
                                </Row>
                            </Header>
                            <Body>
                                {this.renderRows()}
                            </Body>
                        </Table>
                    </Grid.Row>
                    <Grid.Row>
                        <div>Found {this.props.requestsCount} requests</div>
                    </Grid.Row>
                </Grid>
            </Layout>
        )
    }
}

export default RequestIndex;