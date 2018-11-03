// @flow
import * as React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { setLocale } from './store/app/actions';
import 'bootstrap/dist/css/bootstrap.min.css';

import css from './App.module.css';
// import $ from 'jquery';
// import bootstrap from 'bootstrap';

type PropsT = {
    setLocale: (string) => {},
};

class App extends React.PureComponent<PropsT> {
    setLanguage = (e: SyntheticEvent<HTMLButtonElement>) => {
        this.props.setLocale(e.target.value);
    };

    render() {
        return (
            <div className={css.wrapper}>
                <Helmet defaultTitle="Cashierless Store" titleTemplate="%s – Cashierless Store" />
                <header>
                    <div className="navbar navbar-dark bg-dark shadow-sm">
                        <div className="container d-flex justify-content-between">
                            <a href="#" className="navbar-brand d-flex align-items-center">
                                <strong>Cashierless Store</strong>
                            </a>
                        </div>
                    </div>
                </header>

                <main role="main">
                    <section
                        className="jumbotron jumbotron-fluid"
                        style={{ marginBottom: '0px', height: '100vh' }}
                    >
                        <div className="container">
                            <p>TODO: add Routes</p>
                        </div>
                    </section>
                </main>
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
