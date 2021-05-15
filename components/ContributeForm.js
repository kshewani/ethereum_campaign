import { Router } from '../routes';
import React, { Component } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';

class ContributeForm extends Component {
    state = {
        value: '',
        loading: false,
        errorMessage: ''
    }

    onSubmit = async (event) => {
        event.preventDefault();
        this.setState({ loading: !this.state.loading, errorMessage: '' });
        const campaign = Campaign(this.props.address);

        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(this.state.value, 'ether')
            });
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }

        this.setState({ loading: !this.state.loading, value: '' });
        Router.replaceRoute(`/campaigns/${this.props.address}`);
    }

    render() {
        return(
            <Form onSubmit={this.onSubmit} error={this.state.errorMessage != ''} >
                <Form.Field>
                    <label>Amount to Contribute</label>
                    <Input
                        value={this.state.value}
                        onChange={event => this.setState({ value: event.target.value })}
                        label="ether"
                        labelPosition="right" />
                </Form.Field>
                <Message error header="Oops!" content={this.state.errorMessage} />
                <Button loading={this.state.loading} primary>Contribute</Button>
            </Form>
        );
    }
}

export default ContributeForm;