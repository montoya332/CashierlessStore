// @flow
import * as React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { setLocale } from './store/app/actions';
import Checkout from './pages/Checkout';
import css from './App.module.css';

type PropsT = {
    setLocale: (string) => {},
};

class App extends React.PureComponent<PropsT> {
    setLanguage = (e: SyntheticEvent<HTMLButtonElement>) => {
        this.props.setLocale(e.target.value);
    };

    render() {
        const appName = 'Cashierless Store';
        return (
            <div className={css.wrapper}>
                <Helmet defaultTitle={appName} titleTemplate={`%s – ${appName}`} />
                <Checkout />
            </div>
        );
    }
}

const mapDispatchToProps = {
    setLocale,
};

export default connect(
    null,
    mapDispatchToProps
)(withNamespaces()(App));
