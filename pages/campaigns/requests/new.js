import React, { Component } from 'react';
import { Form, Button, Message, Input, Menu } from 'semantic-ui-react';
import Campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
import { Link, Router } from '../../../routes';
import Layout from '../../../components/Layout';

export async function getServerSideProps(props) {
    const address = props.query.address;
    console.log(address);
    return { props: { address: address  } }
}

class RequestNew extends Component {
    state= {
        value: '',
        description: '',
        recipient: '',
        errorMessage: '',
        loading: false
    }

    onSubmit = async (event) => {
        event.preventDefault();
        this.setState({ errorMessage: '', loading: !this.state.loading });

        try {
            console.log(this.state);
            console.log(this.props.address);
            const accounts = await web3.eth.getAccounts();
            const campaign = Campaign(this.props.address);
            const { description, value, recipient } = this.state;
            await campaign.methods.createRequest(
                description,
                web3.utils.toWei(value, 'ether'),
                recipient).send({ from: accounts[0] }
            );
            Router.pushRoute(`/campaigns/${this.props.address}/requests`);
        } catch (err) {
            this.setState( { errorMessage: err.message } );
        }
        finally {
            this.setState({ loading: !this.state.loading });
        }
    }

    render() {
        return(
            <Layout>
                <h3>Create a Request</h3>
                <Form onSubmit={this.onSubmit} error={this.state.errorMessage != ''} >
                    <Form.Field>
                        <label>Description</label>
                        <Input
                            value={this.state.description}
                            onChange={event => this.setState({ description: event.target.value })}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Value (ether)</label>
                        <Input
                            value={this.state.value}
                            onChange={event => this.setState({ value: event.target.value })}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Recipient</label>
                        <Input
                            value={this.state.recipient}
                            onChange={event => this.setState({ recipient: event.target.value })}
                        />
                    </Form.Field>
                    <Message error header="Oops!" content={this.state.errorMessage} />
                    <Button loading={this.state.loading} primary>Create</Button>
                    <Link route={`/campaigns/${this.props.address}/requests`}>
                    <a>
                        <Button primary>Cancel</Button>
                    </a>
                </Link>
                </Form>
            </Layout>
        )
    }
}

export default RequestNew;