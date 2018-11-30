// @flow
import * as React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { setLocale, signOutUser } from './store/app/actions';
import Analytics from './pages/analytics/Graph';
import Checkout from './pages/checkoutPage';
import Dashboard from './pages/dashboard';
import Products from './pages/products';
import Account from './pages/account';
import Signin from './pages/signin';
import Signup from './pages/signup';
// import Home from './pages/home';
import Orderhistory from './pages/orderhistory';

import css from './App.module.css';
import { Switch, Route } from 'react-router';
import axios from 'axios';

type PropsT = {
    setLocale: (string) => {},
};

const Page404 = () => <h1>404</h1>;
class App extends React.PureComponent<PropsT> {
    setLanguage = (e: SyntheticEvent<HTMLButtonElement>) => {
        this.props.setLocale(e.target.value);
    };
    handleSignOut = () => {
        axios.get('/api/rekognition/signout').then(() => {
            this.props.signOutUser();
        });
    };

    renderRoutes() {
        const { user } = this.props;
        if (user.userId) {
            //TODO: remove true , used to avoid signin for now
            return (
                <Switch>
                    <Route path="/analytics" component={Analytics} />
                    <Route path="/order" component={Checkout} />
                    <Route path="/orderhistory" component={Orderhistory} />
                    <Route path="/products" component={Products} />
                    <Route path="/account" component={Account} />
                    <Route path="/404" component={Page404} />
                    <Route component={Checkout} />
                </Switch>
            );
        }
        return (
            <Switch>
                <Route path="/signup" component={Signup} />
                <Route component={Signin} />
            </Switch>
        );
    }
    render() {
        const appName = 'Cashierless Store';
        const { user } = this.props;
        return (
            <div className={css.wrapper}>
                <Helmet defaultTitle={appName} titleTemplate={`%s – ${appName}`} />
                <Dashboard handleSignOut={this.handleSignOut} showDrawer={!!user.userId}>
                    {this.renderRoutes()}
                </Dashboard>
            </div>
        );
    }
}
App.propTypes = {
    user: PropTypes.object,
    signOutUser: PropTypes.func,
};
const mapDispatchToProps = {
    signOutUser,
    setLocale,
};
const mapStateToProps = (state) => {
    console.log('state: ', state);
    return {
        location: state.router.location,
        user: state.user,
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withNamespaces()(App));
