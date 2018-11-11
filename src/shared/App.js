// @flow
import * as React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { setLocale } from './store/app/actions';
import Analytics from './pages/analytics';
import Checkout from './pages/checkout';
import Dashboard from './pages/dashboard';
import Products from './pages/products';
import Signin from './pages/signin';
import Orderhistory from './pages/orderhistory';

import css from './App.module.css';
import { Route } from 'react-router';

type PropsT = {
    setLocale: (string) => {},
};

class App extends React.PureComponent<PropsT> {
    setLanguage = (e: SyntheticEvent<HTMLButtonElement>) => {
        this.props.setLocale(e.target.value);
    };
    renderContainer() {
        return (
            <div>
                <Route path="/analytics" component={Analytics} />
                <Route path="/order" component={Checkout} />
                <Route path="/orderhistory" component={Orderhistory} />
                <Route path="/products" component={Products} />
                <Route path="/signin" component={Signin} />
                <Route path="/account" component={Signin} />
            </div>
        );
    }
    render() {
        const appName = 'Cashierless Store';
        return (
            <div className={css.wrapper}>
                <Helmet defaultTitle={appName} titleTemplate={`%s – ${appName}`} />
                <Dashboard>{this.renderContainer()}</Dashboard>
            </div>
        );
    }
}

const mapDispatchToProps = {
    setLocale,
};
const mapStateToProps = (state) => {
    console.log('state: ', state);
    return {
        location: state.router.location,
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withNamespaces()(App));
