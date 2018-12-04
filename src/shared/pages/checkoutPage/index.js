import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import List from '../../components/list';
import Camera from '../../components/camera';
import css from '../../App.module.css';
import axios from 'axios/index';
import { connect } from 'react-redux';

const styles = (theme) => ({
    appBar: {
        position: 'relative',
    },
    layout: {
        width: 'auto',
        marginLeft: theme.spacing.unit * 2,
        marginRight: theme.spacing.unit * 2,
        [theme.breakpoints.up(600 + theme.spacing.unit * 2 * 2)]: {
            width: 600,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit * 3,
        padding: theme.spacing.unit * 2,
        [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
            marginTop: theme.spacing.unit * 6,
            marginBottom: theme.spacing.unit * 6,
            padding: theme.spacing.unit * 3,
        },
    },
    stepper: {
        padding: `${theme.spacing.unit * 3}px 0 ${theme.spacing.unit * 5}px`,
    },
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button: {
        marginTop: theme.spacing.unit * 3,
        marginLeft: theme.spacing.unit,
    },
});

const steps = ['User Details', 'Cart Details', 'Review your order'];

class Checkout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeStep: 0,
            orderItems: [],
            items: [],
            todisplay: [],
            errmsg: '',
            errmsg1: '',
        };
    }

    handleNext = (e) => {
        const { activeStep } = this.state;
        console.log('handleNext: ', activeStep, e);
        if (activeStep === 1) {
            axios
                .post('/api/order/confirmClick', { email: this.props.user.email })
                .then((response) => {
                    console.log(response.data.status);
                    if (response.data.status == false) {
                        console.log('in');
                        this.setState((state) => ({
                            errmsg1: 'You need to atleast scan one item before placing any order!!',
                        }));
                        console.log(this.state.errmsg);
                    } else if (response.data.status == true) {
                        axios
                            .post('/api/order/getOrder', { email: this.props.user.email })
                            .then((response) => {
                                this.setState({
                                    activeStep: activeStep + 1,
                                    todisplay: response.data.items,
                                });
                            });
                    }
                });
        } else if (activeStep === 2) {
            axios
                .post('/api/order/getUserCard', { email: this.props.user.email })
                .then((response) => {
                    console.log(response.data.status);
                    if (response.data.status == false) {
                        console.log('in');
                        this.setState((state) => ({
                            errmsg: 'Please Enter your card detail before confirming order!!',
                        }));
                        console.log(this.state.errmsg);
                    } else if (response.data.status == true) {
                        axios
                            .post('/api/order/updateActive', { email: this.props.user.email })
                            .then((response) => {
                                console.log(response);
                            });
                        this.setState((state) => ({
                            activeStep: state.activeStep + 1,
                        }));
                    }
                });
        } else {
            this.setState((state) => ({
                activeStep: state.activeStep + 1,
            }));
        }
    };

    handleBack = () => {
        this.setState((state) => ({
            activeStep: state.activeStep - 1,
        }));
    };

    handleReset = () => {
        this.setState({
            activeStep: 0,
        });
    };
    handleUserDetails = (r) => {
        console.log(r);
        this.handleNext();
    };
    handleCartDetails = (r) => {
        if (r && r.data && r.data.Labels) {
            this.setState({
                orderItems: r.data.Labels,
            });
            this.handleNext();
        }
    };

    handleScreenShot = (dataUri) => {
        const data = new FormData();
        data.append('file', dataUri);
        axios.post('/api/rekognition/detectLabels', data).then(({ data }) => {
            this.setState(
                {
                    items: data.Labels,
                },
                () => {
                    this.handlePostOrder();
                }
            );
        });
    };

    handlePostOrder = () => {
        const { items } = this.state;
        const { email } = this.props.user;
        axios.post('/api/order/postOrder', { items, email }).then((response) => {
            console.log('added to cart', response);
        });
    };

    fetchOrders = (data) => {
        console.log(data);
    };

    getStepContent = (step) => {
        switch (step) {
            case 0:
                return <List items={[]} />;
            case 1:
                return <Camera onTakePhoto={this.handleScreenShot} />;
            case 2:
                return <List items={this.state.todisplay} />;
            default:
                throw new Error('Unknown step');
        }
    };

    render() {
        const { classes } = this.props;
        const { activeStep } = this.state;

        return (
            <React.Fragment>
                <CssBaseline />
                <Paper className={classes.paper + ' ' + css.muiIconWrapper}>
                    <Typography component="h1" variant="h4" align="center">
                        Checkout
                    </Typography>
                    <Stepper activeStep={activeStep} className={classes.stepper}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    <React.Fragment>
                        {activeStep === 0 ? (
                            <React.Fragment>
                                <Typography variant="h5" gutterBottom>
                                    Hi, {this.props.user.email}
                                </Typography>
                                <Typography variant="subtitle1">
                                    You can start scanning your items now.. Click on Next to place
                                    your order..
                                </Typography>
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                <Typography variant="h5" gutterBottom>
                                    Hi, {this.props.user.email}
                                </Typography>
                            </React.Fragment>
                        )}
                    </React.Fragment>

                    <React.Fragment>
                        {activeStep === 1 ? (
                            <React.Fragment>
                                <Typography variant="h5" gutterBottom style={{ color: 'red' }}>
                                    {this.state.errmsg1}
                                </Typography>
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                <Typography variant="h5" gutterBottom style={{ color: 'red' }}>
                                    {this.state.errmsg}
                                </Typography>
                            </React.Fragment>
                        )}
                    </React.Fragment>

                    <React.Fragment>
                        {activeStep === steps.length ? (
                            <React.Fragment>
                                <Typography variant="h5" gutterBottom>
                                    Thank you for your order.
                                </Typography>
                                <Typography variant="subtitle1">
                                    Your order number is #2001539. We have emailed your order
                                    confirmation, and will send you an update when your order has
                                    shipped.
                                </Typography>
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                {this.getStepContent(activeStep)}
                                <div className={classes.buttons}>
                                    {activeStep !== 0 && (
                                        <Button
                                            onClick={this.handleBack}
                                            className={classes.button}
                                        >
                                            Back
                                        </Button>
                                    )}
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={this.handleNext}
                                        className={classes.button}
                                    >
                                        {activeStep === steps.length - 1 ? 'Place order' : 'Next'}
                                    </Button>
                                </div>
                            </React.Fragment>
                        )}
                    </React.Fragment>
                </Paper>
            </React.Fragment>
        );
    }
}

Checkout.propTypes = {
    user: PropTypes.object,
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    return {
        user: state.user,
    };
};
const mapDispatchToProps = {};

const CheckoutWithStyles = withStyles(styles)(Checkout);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CheckoutWithStyles);

// function stubData(data) {
//     axios.get('/api/order/getOrder', data).then((response) => {
//         console.log(response);
//     });
//     return [
//         { Name: 'Plant', Confidence: 99.71910858154297 },
//         { Name: 'Vegetable', Confidence: 98.99150085449219 },
//         { Name: 'Food', Confidence: 98.99150085449219 },
//         { Name: 'Broccoli', Confidence: 98.99150085449219 },
//         { Name: 'Banana', Confidence: 97.18341064453125 },
//         { Name: 'Fruit', Confidence: 97.18341064453125 },
//         { Name: 'Carrot', Confidence: 72.56779479980469 },
//     ];
// }
