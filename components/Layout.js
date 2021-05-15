import React from 'react';
import Head from 'next/head'
import { Container } from 'semantic-ui-react'
import Header from './Header';
import 'semantic-ui-css/semantic.min.css'

const Layout = (props) => {
    return (
        <Container>
            <div>
                <Head>
                    <title>Campaigns</title>
                </Head>
                <Header />
                {props.children}
            </div>
        </Container>
    );
};

export default Layout;