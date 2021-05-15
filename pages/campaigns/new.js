import React, { Component, createFactory } from 'react';
import Layout from '../../components/Layout';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import campaignFactory from '../../ethereum/campaignfactory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';

class CampaignNew extends Component {
    state = {
        minimumContribution: '',
        errorMessage: '',
        loading: false
    }

    onSubmit = async (event) => {
        event.preventDefault();
        try {
            this.setState({ loading: true, errorMessage: '' });
            const accounts = await web3.eth.getAccounts();
            await campaignFactory.methods
                .createCampaign(this.state.minimumContribution)
                .send({
                    from: accounts[0]
                });
            
            // navigate to root page to show the new campaign in the list or campaigns
            Router.pushRoute('/');
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }

        this.setState({ loading: false });
    }

    render() {
        return(
            <Layout>
                <h3>Create a Campaign</h3>
                <Form error={ this.state.errorMessage != '' } onSubmit={ this.onSubmit }>
                    <Form.Field>
                        <label>Minimum Contribution: </label>
                        <Input
                            label="wei"
                            labelPosition='right'
                            value={this.state.minimumContribution}
                            onChange={event => this.setState({ minimumContribution: event.target.value })}
                            />
                    </Form.Field>
                    <Message error header="Something went wrong!" content={this.state.errorMessage} />
                    <Button loading={this.state.loading} primary>Create</Button>
                </Form>
            </Layout>
        );
    }
}

export default CampaignNew;