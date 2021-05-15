import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import Campaign from '../ethereum/campaign'
import { Router } from '../routes'

class RequestRow extends Component {
    state = {
        approving: false,
        finalizing: false,
        errorMessage: ''
    }

    onApprove = async () => {
        this.setState({ approving: true });
        try {
            const campaign = Campaign(this.props.address);
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.approveRequest(this.props.id).send({
                    from: accounts[0]
            });
        } catch (err) {
            this.setState({ errorMessage: err });
        }
        finally {
            this.setState({ approving: false });
        }
    };

    onFinalize = async () => {
        this.setState({ finalizing: true });
        try {
            const campaign = Campaign(this.props.address);
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.finalizeRequest(this.props.id).send({
                from: accounts[0]
            });
        } catch (err) {
            this.setState({ errorMessage: err });
        }
        finally {
            this.setState({ finalizing: false });
        }
    }

    render() {
        const { Row, Cell } = Table;
        const { id, request } = this.props;
        const readyToFinalize = request.approvalCount > request.approversCount / 2;
        return (
            <Row disabled={request.complete} positive={readyToFinalize && !request.complete}>
                <Cell>{id}</Cell> {/* the code line on the left translates to: <Cell>{this.props.id}</Cell> */}
                <Cell>{request.description}</Cell>
                <Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
                <Cell>{request.recipient}</Cell>
                <Cell>{request.approvalCount}/{this.props.approversCount}</Cell>
                <Cell>
                    {request.complete ? 'Approved' : (
                        <Button loading={this.state.approving} color='green' basic onClick={this.onApprove}>
                            Approve
                        </Button>
                    )}
                </Cell>
                <Cell>
                    {request.complete ? 'Finalized' : (
                        <Button loading={this.state.finalizing} color='teal' basic onClick={this.onFinalize}>
                            Finalize
                        </Button>
                    )}
                </Cell>
            </Row>
        )
    };
}

export default RequestRow;