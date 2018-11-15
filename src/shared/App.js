// @flow
import * as React from 'react';
import PropTypes from 'prop-types';
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
    renderRoutes() {
        const { user } = this.props;
        if (user.userId || user) {
            //TODO: remove true , used to avoid signin for now
            return (
                <div>
                    <Route path="/analytics" component={Analytics} />
                    <Route path="/order" component={Checkout} />
                    <Route path="/orderhistory" component={Orderhistory} />
                    <Route path="/products" component={Products} />
                    <Route path="/signout" component={Analytics} />
                    <Route path="/account" component={Analytics} />
                </div>
            );
        }
        return (
            <div>
                <Route component={Signin} />
            </div>
        );
    }
    render() {
        const appName = 'Cashierless Store';
        const { user } = this.props;
        return (
            <div className={css.wrapper}>
                <Helmet defaultTitle={appName} titleTemplate={`%s – ${appName}`} />
                <Dashboard showDrawer={!!user.userId || !!user}>{this.renderRoutes()}</Dashboard>
            </div>
        );
    }
}
App.propTypes = {
    user: PropTypes.object,
};
const mapDispatchToProps = {
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
