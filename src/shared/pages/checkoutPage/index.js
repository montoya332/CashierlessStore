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
import List2 from '../../components/list/List2';
import Camera from '../../components/camera';
import css from '../../App.module.css';
import axios from 'axios/index';

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
            email: 'harsh@xyz.com',
            items: [
                { Name: 'Plant', Confidence: 99.71910858154297 },
                { Name: 'Vegetable', Confidence: 98.99150085449219 },
                { Name: 'Food', Confidence: 98.99150085449219 },
                { Name: 'Broccoli', Confidence: 98.99150085449219 },
                { Name: 'Banana', Confidence: 97.18341064453125 },
                { Name: 'Fruit', Confidence: 97.18341064453125 },
                { Name: 'Carrot', Confidence: 72.56779479980469 },
            ],
            todisplay: [],
        };
    }

    handleNext = (data) => {
        if (this.state.activeStep == 1) {
            axios.post('/api/order/getOrder', data).then((response) => {
                console.log(response);
                this.setState({
                    todisplay: response.data.items,
                });
            });
            this.setState((state) => ({
                activeStep: state.activeStep + 1,
            }));
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

    handleScreenShot = (data) => {
        axios.post('/api/order/postOrder', data).then((response) => {
            console.log('added to cart');
        });
    };

    fetchOrders = (data) => {};

    getStepContent = (step) => {
        switch (step) {
            case 0:
                return <List items={[]} />;
            case 1:
                return <Camera onTakePhoto={() => this.handleScreenShot(this.state)} />;
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
                                        onClick={() => this.handleNext(this.state)}
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
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Checkout);

function stubData(data) {
    axios.get('/api/order/getOrder', data).then((response) => {
        console.log(response);
    });
    return [
        { Name: 'Plant', Confidence: 99.71910858154297 },
        { Name: 'Vegetable', Confidence: 98.99150085449219 },
        { Name: 'Food', Confidence: 98.99150085449219 },
        { Name: 'Broccoli', Confidence: 98.99150085449219 },
        { Name: 'Banana', Confidence: 97.18341064453125 },
        { Name: 'Fruit', Confidence: 97.18341064453125 },
        { Name: 'Carrot', Confidence: 72.56779479980469 },
    ];
}
