import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';
import axios from 'axios/index';

const styles = (theme) => ({
    layout: {
        width: 'auto',
        display: 'block', // Fix IE11 issue.
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
            width: '90%',
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        // marginTop: theme.spacing.unit * 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit *
            3}px`,
    },
    avatar: {
        margin: theme.spacing.unit,
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE11 issue.
        marginTop: theme.spacing.unit,
    },
    submit: {
        marginTop: theme.spacing.unit * 3,
    },
});

class Account extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const data = this.state;
        console.log(this.state);
        axios.put('/api/users', data).then(({ data }) => {
            if (data && data.userId) {
                //this.props.signInUser(data);
            }
        });
        return false;
    };
    handleChange = (e) => {
        const { value, name } = e.target;
        name && this.setState({ [name]: value });
    };
    render() {
        const { classes, user } = this.props;
        if (!user) {
            return <LinearProgress color="secondary" />;
        }
        return (
            <React.Fragment>
                <CssBaseline />
                <div className={classes.layout}>
                    <Paper className={classes.paper}>
                        <Typography variant="headline">Account Info: </Typography>
                        <form className={classes.form} onSubmit={this.handleSubmit}>
                            <FormControl margin="normal" required fullWidth>
                                <InputLabel htmlFor="first_name">First Name</InputLabel>
                                <Input
                                    id="first_name"
                                    name="first_name"
                                    autoFocus
                                    onChange={this.handleChange}
                                    value={user.first_name}
                                />
                            </FormControl>
                            <FormControl margin="normal" required fullWidth>
                                <InputLabel htmlFor="last_name">Last Name</InputLabel>
                                <Input
                                    id="last_name"
                                    name="last_name"
                                    autoFocus
                                    onChange={this.handleChange}
                                    value={user.last_name}
                                />
                            </FormControl>
                            <FormControl margin="normal" required fullWidth>
                                <InputLabel htmlFor="email">Email Address</InputLabel>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoFocus
                                    onChange={this.handleChange}
                                    value={user.email}
                                />
                            </FormControl>
                            <FormControl margin="normal" required fullWidth>
                                <InputLabel htmlFor="card_details">Card Details</InputLabel>
                                <Input
                                    name="card_details"
                                    type="password"
                                    id="card_details"
                                    onChange={this.handleChange}
                                    value={user.card_details}
                                />
                            </FormControl>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                            >
                                Save
                            </Button>
                        </form>
                    </Paper>
                </div>
            </React.Fragment>
        );
    }
}

Account.propTypes = {
    user: PropTypes.object,
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    return {
        user: state.user,
    };
};
const AccountWithConnected = connect(
    mapStateToProps,
    null
)(Account);

export default withStyles(styles)(AccountWithConnected);
